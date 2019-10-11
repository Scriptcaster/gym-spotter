import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';

@Injectable({ providedIn: 'root' })
export class ItemsResolverService implements Resolve<Item[]> {
    constructor(private itemService: ItemService) {
        console.log(itemService);
     }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.itemService.getItems();
    }
}
