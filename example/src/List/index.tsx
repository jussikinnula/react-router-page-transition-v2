import * as React from 'react';
import { Link } from 'react-router-dom';
import { IItem } from '../Item'
import './index.styl';

interface Props {
  items: IItem[];
  onLinkClick?: Function;
}

export default class List extends React.Component<Props, {}> {
  onClick = () => {
    const { onLinkClick } = this.props;
    if (onLinkClick !== undefined) onLinkClick();
  }

  render() {
    const { items } = this.props;
    return (
      <div className="List transition-item">
        <h1>Hello List</h1>
        <div className="List-items">
        {items.map((item) => (
          <div key={item.id} className="List-items-item">
            <Link
              onClick={this.onClick}
              to={`/item/${item.id}`}
            >
              {item.title}
            </Link>
          </div>
        ))}
        </div>
      </div>
    );
  }
};
