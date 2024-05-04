import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { PlanItem } from '@myComponents/PlanItem/PlanItem.tsx';
import './search.css';

export function Component() {
  return <Search></Search>;
}

export const Search: FC = () => {
  const param = useParams();
  const [articles, setArticles] = useState<
    {
      article_id: string;
      user: string;
    }[]
  >([]); // PlanItem[] is from '@myComponents/PlanItem/PlanItem.tsx'
  const getArticlesFetch = useCallback(async () => {
    try {
      const res = await fetchData<
        {
          articles: {
            article_id: string;
            user: string;
          }[];
        },
        {
          keyword: string | undefined;
        }
      >(
        'POST',
        {
          url: '/api/searchs/search-articles'
        },
        {
          keyword: param.id
        }
      );
      if (res.code === 200) {
        setArticles(res.data.articles);
      } else {
        ErrorMessage('获取文章列表失败', 2000);
      }
    } catch (error) {
      ErrorMessage('获取文章列表失败', 2000);
    }
  }, [param.id]);
  useEffect(() => {
    getArticlesFetch();
  }, [getArticlesFetch]);
  return (
    <div className="search-container">
      {articles &&
        articles.map(item => {
          return (
            <PlanItem
              key={item.article_id}
              articleID={item.article_id}
              userName={item.user}
              type="other"
              from="search"
            />
          );
        })}
    </div>
  );
};
