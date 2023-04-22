import React, { useState } from 'react';
import ReactDragListView from 'react-drag-listview';

interface Item {
  title: string;
}

const Demo: React.FC = () => {
  const [data, setData] = useState<Item[]>(
    Array.from({ length: 6 }, (_, i) => ({ title: `rows${i + 1}` }))
  );

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    const newData = [...data];
    const item = newData.splice(fromIndex, 1)[0];
    newData.splice(toIndex, 0, item);
    setData(newData);
  };

  return (
    <ReactDragListView onDragEnd={handleDragEnd} nodeSelector="li" handleSelector="a">
      <ol>
        {data.map((item, index) => (
          <li key={index}>
            {item.title}
            <a href="#">Drag</a>
          </li>
        ))}
      </ol>
    </ReactDragListView>
  );
};

export default Demo;
