import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsComponent } from './components/items/items.component';
import { AuthGuard } from './services/auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  // { path: '', redirectTo: '/items', pathMatch: 'full' },
  // { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
