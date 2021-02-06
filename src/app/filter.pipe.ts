import { Pipe, PipeTransform } from '@angular/core';
import { PostModel } from './shared/post-model';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: PostModel[], searchText: string): PostModel[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.postName.toLocaleLowerCase().includes(searchText);
    });
  }
}