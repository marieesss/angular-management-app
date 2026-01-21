import { Component, inject, Input, signal } from '@angular/core';
import { CommentService } from '../service/comment';
import { Commentaire } from '../interface/comment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  private commentsService = inject(CommentService);
  private authService = inject(AuthService);
  comments = signal<Commentaire[]>([]);
  @Input() id?: number;
  private fb = inject(FormBuilder)

  
  commentForm = this.fb.nonNullable.group({
    comment: ['', Validators.required],
  })

  onSubmit() {
    if (this.id) {

     const comment : Commentaire = {
        taskId: this.id,
        authorName: this.authService.currentUser()?.username || 'Unknown',
        content: this.commentForm.getRawValue().comment,
        authorId: this.authService.currentUser()?.id || 0,
        createdAt: new Date().toISOString()
      };

      this.commentsService.createComment(comment);
      this.comments.set([...this.comments(), comment]);
      this.commentForm.reset();
    }
  }


  ngOnInit() {
   this.comments.set(this.commentsService.getCommentById(this.id!));
  }

  onDeleteComment(commentId: number) {
    this.commentsService.deleteComment(commentId);
    const updatedComments = this.comments().filter(comment => comment.id !== commentId);
    this.comments.set(updatedComments);
  }
}
