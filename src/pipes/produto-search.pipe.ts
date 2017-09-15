import {Pipe, PipeTransform} from '@angular/core';

import {Produto} from '../models';

@Pipe({
  name: 'produtoSearch'
})
export class ProdutoSearchPipe implements PipeTransform {
  transform(produtos:Produto[], searchString: string) : any {
    let matches: Produto[] = [];

    if (!searchString) {
      return produtos;
    }

    produtos.forEach(function (produto) {
      if (produto.name.match(new RegExp(searchString, 'i'))) {
        matches.push(produto);
      }
    });

    return matches;
  }
}