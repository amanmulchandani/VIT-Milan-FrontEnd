import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { SubredditModel } from '../subreddit-model';
import { SubredditService } from '../subreddit.service';

@Component({
  selector: 'app-create-subreddit',
  templateUrl: './create-subreddit.component.html',
  styleUrls: ['./create-subreddit.component.css']
})
export class CreateSubredditComponent implements OnInit {

  subredditForm: FormGroup;
  subredditModel: SubredditModel;
  title = new FormControl('');
  description = new FormControl('');
  
  constructor(private router: Router, private subredditService: SubredditService, private toastr: ToastrService) {
    this.subredditForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3) ,Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5) ,Validators.maxLength(255)])
    });
    this.subredditModel = {
      name: '',
      description: ''
    }
  }

  ngOnInit(): void {
  }

  discard() {
    this.router.navigateByUrl('/');
  }

  createSubreddit() {
    this.subredditForm.get('title').setValue(this.subredditForm.get('title').value.toString().trim());
    this.subredditForm.get('description').setValue(this.subredditForm.get('description').value.toString().trim());

    if(this.subredditForm.valid){
      this.subredditModel.name = this.subredditForm.get('title').value;
      this.subredditModel.description = this.subredditForm.get('description').value;
      this.subredditService.createSubreddit(this.subredditModel).subscribe(data => {
      this.router.navigateByUrl('/list-subreddits');
      }, error => {
        this.toastr.error('Subreddit already exists');
        throwError(error);
      })
    }
  }
    
}
