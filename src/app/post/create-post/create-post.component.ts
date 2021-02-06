import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { PostService } from 'src/app/shared/post.service';
import { SubredditModel } from 'src/app/subreddit/subreddit-model';
import { SubredditService } from 'src/app/subreddit/subreddit.service';
import { CreatePostPayload } from './create-post.payload';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  postForm: FormGroup;
  postPayload: CreatePostPayload;
  subreddits: Array<SubredditModel>;

  constructor(private router: Router, private postService: PostService,
    private subredditService: SubredditService, private toastr: ToastrService) {
    this.postPayload = {
      postName: '',
      url: '',
      description: '',
      subredditName: ''
    }
  }

  ngOnInit() {
    this.postForm = new FormGroup({
      postName: new FormControl('', [Validators.required, Validators.minLength(3) ,Validators.maxLength(40)]),
      subredditName: new FormControl('', Validators.required),
      url: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });
    this.subredditService.getAllSubreddits().subscribe((data) => {
      this.subreddits = data;
    }, error => {
      throwError(error);
    });
  }

  createPost() {

    this.postForm.get('postName').setValue(this.postForm.get('postName').value.toString().trim());
    this.postForm.get('description').setValue(this.postForm.get('description').value.toString().trim());
    
    if(this.postForm.valid){
      this.postPayload.postName = this.postForm.get('postName').value;
      this.postPayload.subredditName = this.postForm.get('subredditName').value;
      this.postPayload.description = this.postForm.get('description').value;

      this.postService.createPost(this.postPayload).subscribe((data) => {
        this.router.navigateByUrl('/');
      }, error => {
        this.toastr.error("Post already exists!");
        throwError(error);
      })
    }
    
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }

}
