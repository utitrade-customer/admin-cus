import React from 'react';
interface ArticlePreviewProps {
  article: any;
}
export const ArticlePreview = (props: ArticlePreviewProps) => {
  return (
    <div>
      <h1>{props.article.headline}</h1>
      <p>{props.article.description}</p>
      <div
        style={{ maxHeight: '50vh', overflowX: 'hidden', overflowY: 'scroll' }}
        dangerouslySetInnerHTML={{ __html: props.article.body }}
      ></div>
    </div>
  );
};
