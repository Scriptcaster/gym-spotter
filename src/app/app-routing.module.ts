import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DayEditComponent } from './components/weeks/day-edit/day-edit.component';
import { WeeksComponent } from './components/weeks/weeks.component';

const routes: Routes = [
  // { path: '', redirectTo: '/items', pathMatch: 'full' },
  // { path: '', component: ItemsComponent },
  { path: '', component: WeeksComponent },
  // { path: 'new week', component: WeekEditComponent },
  { path: 'new', component: DayEditComponent },
  { path: ':id', component: DayEditComponent },
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
