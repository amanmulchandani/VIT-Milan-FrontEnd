import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PostModel } from '../post-model';
import { PostService } from '../post.service';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostTileComponent implements OnInit {

  faComments = faComments;
  @Input() posts: PostModel[];
  @Input() deleteFlag: boolean;
  @Input() editFlag: boolean;
  searchText = "";

  constructor(private router: Router, private postService: PostService) { }

  ngOnInit(): void {

  }

  goToPost(id: number): void {
    this.router.navigateByUrl('/view-post/' + id);
  }

  editPost(id: number): void{
    this.router.navigateByUrl('/edit-post/' + id);
  }

  deletePost(id: number): void {
    this.postService.deletePost(id).subscribe((data) => {
      window.location.reload();
    }, error => {
      throwError(error);
    })
  }

  confirmDelete(id: number): void{
    if(confirm('Are you sure you want to delete this post?')){
      this.deletePost(id);
    }
  }

}
