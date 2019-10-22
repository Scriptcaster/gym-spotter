import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';

import { HeaderComponent } from './components/header/header.component';

import { WeekService } from './services/week.service';
import { WeeksComponent } from './components/weeks/weeks.component';
import { DayComponent } from './components/weeks/day/day.component';

import { DayEditComponent } from './components/weeks/day-edit/day-edit.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReversePipe } from './pipes/reverse.pipe';
import { DialogNewExercise } from './dialogs/dialog-new-exercise';



@NgModule({
  declarations: [
    AppComponent, 
    HeaderComponent, 
    DayEditComponent, 
    DayComponent, 
    WeeksComponent, 
    ReversePipe,
    DialogNewExercise
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,

    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,

    HttpClientModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,

    FlexLayoutModule,
    MatDialogModule
  ],
  entryComponents: [
    DialogNewExercise
  ],
  providers: [WeekService],
  bootstrap: [AppComponent]
})
export class AppModule {}
