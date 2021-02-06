import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId: number;
  post: PostModel;
  commentForm: FormGroup;
  commentPayload: CommentPayload;
  comments: CommentPayload[];
  
  constructor(private postService: PostService, private activateRoute: ActivatedRoute,
    private commentService: CommentService, private authService: AuthService) {
    this.postId = this.activateRoute.snapshot.params.id;
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentPayload = {
      text: '',
      postId: this.postId
    };
  }

  ngOnInit(): void {
    this.getPostById();
    this.getCommentsForPost();
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text').value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text').setValue('');
      this.getCommentsForPost();
    }, error => {
      throwError(error);
    })
  }

  private getPostById() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });
  }

  private getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data;
    }, error => {
      throwError(error);
    });
  }

  private deleteComment(id: number){
    this.commentService.deleteComment(id).subscribe((data) => {
      this.getCommentsForPost();
    }, error => {
      throwError(error);
    })
  }

  confirmDelete(id: number): void{
    if(confirm('Are you sure you want to delete this comment?')){
      this.deleteComment(id);
    }
  }

  checkCommentUser(commentUsername: string): boolean{
    // console.log("commentUsername -> " + commentUsername + "\nAuthService username -> " + this.authService.getUserName() + "\nEquality -> " + (commentUsername === this.authService.getUserName()));
    // console.log(commentUsername);
    return commentUsername === this.authService.getUserName();
  }

}
