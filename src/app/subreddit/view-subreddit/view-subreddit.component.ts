import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { PostModel } from 'src/app/shared/post-model';
import { PostService } from 'src/app/shared/post.service';
import { SubredditModel } from '../subreddit-model';
import { SubredditService } from '../subreddit.service';

@Component({
  selector: 'app-view-subreddit',
  templateUrl: './view-subreddit.component.html',
  styleUrls: ['./view-subreddit.component.css']
})
export class ViewSubredditComponent implements OnInit {

  posts: Array<PostModel> = [];
  subredditId: number;
  subreddit: SubredditModel;

  constructor(private postService: PostService, private subredditService: SubredditService, private activateRoute: ActivatedRoute) {
    this.subredditId = this.activateRoute.snapshot.params.id;
    
   }

  ngOnInit(): void {
    this.getSubredditById(this.subredditId);
    this.getAllPostsBySubreddit(this.subredditId);
  }

  private getSubredditById(id: number) {
    this.subredditService.getSubredditById(id).subscribe(data => {
      this.subreddit = data;
    }, error => {
      throwError(error);
    });
  }

  private getAllPostsBySubreddit(id: number){
    this.postService.getAllPostsBySubreddit(this.subredditId).subscribe(post => {
      this.posts = post;
    }, error => {
      throwError(error);
    });
  }

}
