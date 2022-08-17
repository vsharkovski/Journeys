import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { JourneyCreationFormComponent } from './components/journey-creation-form/journey-creation-form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BigSearchComponent } from './components/big-search/big-search.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

const routes: Routes = [
    {
        path: 'home',
        component: NewsFeedComponent,
        data: {
            onlyFollowedUsers: true,
            title: 'Journeys from people you follow',
        },
    },
    {
        path: 'explore',
        component: NewsFeedComponent,
        data: { title: 'Recent journeys from everyone' },
    },
    { path: 'search', component: BigSearchComponent },
    { path: 'new-journey', component: JourneyCreationFormComponent },
    { path: 'journey/:id', component: PostDetailComponent },
    { path: 'profile/:id', component: ProfileComponent },
    { path: 'not-found', component: NotFoundPageComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', redirectTo: 'not-found' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
