import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsComponent } from './components/items/items.component';
import { AuthGuard } from './services/auth.guard';
import { AppComponent } from './app.component';
import { ItemEditComponent } from './components/items/item-edit/item-edit.component';
import { ItemsResolverService } from './components/items/items-resolver.service';

const routes: Routes = [
  // { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: '', component: ItemsComponent },
  { path: 'new', component: ItemEditComponent },
  { path: ':id', component: ItemEditComponent },
  // { path: 'items', component: ItemsComponent, 
  //   children: [
  //     { path: 'new', component: ItemEditComponent },
  //     { path: ':id', component: ItemEditComponent },
  //   ]
  // },
  
  // { path: ':id', component: ItemEditComponent, resolve: [ItemsResolverService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
