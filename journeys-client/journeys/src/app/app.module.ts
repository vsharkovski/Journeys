import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { httpInterceptorProviders } from './helpers/http.interceptor';
import { MiniSearchComponent } from './components/mini-search/mini-search.component';
import { PostPreviewComponent } from './components/post-preview/post-preview.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JourneyCreationFormComponent } from './components/journey-creation-form/journey-creation-form.component';
import { FollowUnfollowButtonComponent } from './components/follow-unfollow-button/follow-unfollow-button.component';
import { LikeUnlikeButtonComponent } from './components/like-unlike-button/like-unlike-button.component';
import { BigSearchComponent } from './components/big-search/big-search.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { LocationSearchComponent } from './components/location-search/location-search.component';
import { TagComponent } from './components/tag/tag.component';
import { LocationPickerComponent } from './components/location-picker/location-picker.component';
import { TagContainerComponent } from './components/tag-container/tag-container.component';
import { UserListModalComponent } from './components/user-list-modal/user-list-modal.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { ImageSourcePipe } from './helpers/image-source.pipe';

@NgModule({
    declarations: [
        AppComponent,
        NewsFeedComponent,
        NavbarComponent,
        ProfileComponent,
        MiniSearchComponent,
        PostPreviewComponent,
        PostDetailComponent,
        JourneyCreationFormComponent,
        FollowUnfollowButtonComponent,
        LikeUnlikeButtonComponent,
        BigSearchComponent,
        CommentComponent,
        CommentListComponent,
        NotFoundPageComponent,
        DatePickerComponent,
        LocationMapComponent,
        LocationSearchComponent,
        TagComponent,
        LocationPickerComponent,
        TagContainerComponent,
        UserListModalComponent,
        ImageUploadComponent,
        LoginModalComponent,
        RegisterModalComponent,
        ImageSourcePipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        LeafletModule,
    ],
    providers: [httpInterceptorProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}
