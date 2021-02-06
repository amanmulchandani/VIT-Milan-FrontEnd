import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';
import { CreatePostPayload } from '../create-post/create-post.payload';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  postId: number;
  post: PostModel;
  postPayload: CreatePostPayload;
  postForm: FormGroup;

  constructor(private activateRoute: ActivatedRoute, private postService: PostService, private router: Router,
    private toastr: ToastrService) {
    this.postId = this.activateRoute.snapshot.params.id;
    this.postPayload = {
      postName: '',
      url: '',
      description: '',
      subredditName: ''
    };
   }

  ngOnInit(){
    this.postForm = new FormGroup({
      postName: new FormControl('', [Validators.required, Validators.minLength(3) ,Validators.maxLength(40)]),
      subredditName: new FormControl(''),
      url: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;   
      this.postForm.get('postName').setValue(this.post.postName);
      this.postForm.get('description').setValue(this.post.description);
    }, error => {
      console.log("Error reading post data!");
    });

  }

  discardPost() {
    this.router.navigateByUrl('/user/' + this.post.userName);
  }

  savePost() {

    this.postForm.get('postName').setValue(this.postForm.get('postName').value.toString().trim());
    this.postForm.get('description').setValue(this.postForm.get('description').value.toString().trim());

    if(this.postForm.valid){
      this.postPayload.postName = this.postForm.get('postName').value;
      this.postPayload.subredditName = this.post.subredditName;
      this.postPayload.description = this.postForm.get('description').value;

      this.postService.editPost(this.postPayload, this.postId).subscribe((data) => {
        this.router.navigateByUrl('/user/' + this.post.userName);
      }, error => {
        this.toastr.error("Post already exists!");
        throwError(error);
      })
    }
    
  }

}
