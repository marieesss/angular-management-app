import { Injectable } from '@angular/core';
import { Commentaire } from '../interface/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  createComment(comment : Commentaire){
    const comments = this.getComments();
    // If no comments, set id to 1
    comment.id = comments[comments.length - 1]?.id ? comments[comments.length - 1].id! + 1 : 1;
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
  }

  getComments() : Commentaire[] {
    const comments = localStorage.getItem('comments');
    return comments ? JSON.parse(comments) : [];
  }

  deleteComment(commentId: number){
    const comments = this.getComments();
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  }

  getCommentById(commentId: number) : Commentaire[] {
    const comments = this.getComments();
    return comments.filter(comment => comment.taskId === commentId)!;
  }
  
}
