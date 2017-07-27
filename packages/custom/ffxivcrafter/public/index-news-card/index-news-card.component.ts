import { Component, OnInit } from '@angular/core'

import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'index-news-card2',
  templateUrl: './index-news-card.component.html'
})
export class IndexNewsCardComponent implements OnInit {
  newsText: string = 'Empty String And Stuff'

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Make the HTTP request:
    this.http.get('/api/rest/applicationsetting?name=newsText').subscribe(data => {
      console.log(data)
      // Read the result field from the JSON response.
      this.newsText = data['text'];
    });
  }

}
