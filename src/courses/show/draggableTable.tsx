import { Table } from 'antd';
import React, { useState } from 'react';
import ReactDragListView from 'react-drag-listview';

interface DataItem {
    key: string;
    name: string;
    gender: string;
    age: string;
    address: string;
}

const DraggableTable: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([
        {
            key: '1',
            name: 'Boran',
            gender: 'male',
            age: '12',
            address: 'New York',
        },
        {
            key: '2',
            name: 'JayChou',
            gender: 'male',
            age: '38',
            address: 'TaiWan',
        },
        {
            key: '3',
            name: 'Lee',
            gender: 'female',
            age: '22',
            address: 'BeiJing',
        },
        {
            key: '4',
            name: 'ChouTan',
            gender: 'male',
            age: '31',
            address: 'HangZhou',
        },
        {
            key: '5',
            name: 'AiTing',
            gender: 'female',
            age: '22',
            address: 'Xi’An',
        },
    ]);

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Operates',
            key: 'operate',
            render: (text: string, record: DataItem, index: number) => (
                <a className="drag-handle" href="#">
                    Drag
                </a>
            ),
        },
    ];

    const dragProps = {
        onDragEnd(fromIndex: number, toIndex: number) {
            const newData = [...data];
            const item = newData.splice(fromIndex, 1)[0];
            newData.splice(toIndex, 0, item);
            setData(newData);
        },
        handleSelector: 'a',
        ignoreSelector: 'tr.ant-table-expanded-row',
        nodeSelector: 'tr.ant-table-row',
    };

    return (
        <div style={{ margin: 20 }}>
            <h2>Table row with dragging</h2>
            <ReactDragListView {...dragProps}>
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={data}
                    expandedRowRender={(record: DataItem) => record.address}
                />
            </ReactDragListView>
        </div>
    );
};

export default DraggableTable;