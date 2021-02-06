import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  name: string;
  posts: PostModel[];
  comments: CommentPayload[];
  postLength: number;
  commentLength: number;
  deleteFlag: boolean;
  editFlag: boolean;

  constructor(private activatedRoute: ActivatedRoute, private postService: PostService,
    private commentService: CommentService, private router: Router, private authService: AuthService) {

    this.name = this.activatedRoute.snapshot.params.name;
    this.deleteFlag = (this.name == authService.getUserName());
    this.editFlag = this.deleteFlag;

    this.postService.getAllPostsByUser(this.name).subscribe(data => {
      this.posts = data;
      this.postLength = data.length;
    });
    this.commentService.getAllCommentsByUser(this.name).subscribe(data => {
      this.comments = data;
      this.commentLength = data.length;
    });
  }

  ngOnInit(): void {
  }

  goToPost(id: number): void{
    this.router.navigateByUrl('/view-post/' + id);
  }

}
