import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  query(
    config: ArticleListConfig,
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });
  
    // Task 1 solution with mock data

    const mockArticles: Article[] = [
      {
        slug: "mock-article-1",
        title: "Mock 1",
        description: "Mock desc 1",
        body: "Mock body 1",
        tagList: ["Mock Tag 1", "Mock Tag 2"],
        createdAt: "01-01-2000",
        updatedAt: "02-02-2000",
        favorited: false,
        favoritesCount: 0,
        author: {
          username: "Mock username 1",
          bio: "Mock bio 1",
          image: "Mock image 1",
          following: false
        }
      },
    ];

    const mockObservable = new Observable<{ articles: Article[]; articlesCount: number }>(observer => {
      observer.next({ articles: mockArticles, articlesCount: 1 });

      observer.complete();
    });

    return mockObservable;

    // Removed previous version
    // return this.http.get<{ articles: Article[]; articlesCount: number }>(
    //   "/articles" + (config.type === "feed" ? "/feed" : ""),
    //   { params },
    // );
  }

  get(slug: string): Observable<Article> {
    return this.http
      .get<{ article: Article }>(`/articles/${slug}`)
      .pipe(map((data) => data.article));
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  create(article: Partial<Article>): Observable<Article> {
    return this.http
      .post<{ article: Article }>("/articles/", { article: article })
      .pipe(map((data) => data.article));
  }

  update(article: Partial<Article>): Observable<Article> {
    return this.http
      .put<{ article: Article }>(`/articles/${article.slug}`, {
        article: article,
      })
      .pipe(map((data) => data.article));
  }

  favorite(slug: string): Observable<Article> {
    return this.http
      .post<{ article: Article }>(`/articles/${slug}/favorite`, {})
      .pipe(map((data) => data.article));
  }

  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/favorite`);
  }
}
