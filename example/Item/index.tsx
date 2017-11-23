import * as React from 'react';
import './index.styl';

function getItem(id?: string | number, items?: IItem[]): IItem {
  if (id !== undefined && items !== undefined) {
    let itemId: number;
    if (typeof id === 'string') itemId = parseInt(id, 10);
    else itemId = id;
    return items.filter(item => item.id === itemId)[0];
  }
}

export interface IItem {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Props {
  items: IItem[];
  match: any;
  goBack: Function;
}

const Item = ({ items, match, goBack }: Props) => {
  const item = getItem(match.params.id, items);
  let title, body;
  if (item !== undefined) {
    title = item.title;
    body = item.body;
  } else {
    title = 'Item Not Found';
    body = 'Item you requested was not found. Please try again.'
  }

  return (
    <div className="Item transition-item">
      <p><button onClick={() => goBack()}>Go back</button></p>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
};

export default Item;