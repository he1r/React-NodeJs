import React, { useState, useEffect } from 'react'
import '../css/Profile.css'
import { Table } from 'antd'
import axios from 'axios';
import 'antd/dist/antd.css'

//HOME COMPONENT
const ProductTable = () => {
    const columns = [
        {
            title: 'Company Name',
            dataIndex: 'CName',
            key: "CName"
        },
        {
            title: 'Stock Price',
            dataIndex: 'StockPrice',
            key: "StockPrice"
        },
        {
            title: 'Country',
            dataIndex: 'Country',
            key: "Country"
        },
    ];

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        var config = {
            method: 'post',
            url: 'http://localhost:3001/companies',
            data: {}
        }
        axios(config).then(function (response) {
            setData(response.data)
            setLoading(false)
        }).catch(function (err) {

        })
    }, [])
    return (
        <div className='antdTable'>
            <div>
                <Table dataSource={data} columns={columns}
                    loading={loading} size='small'
                    bordered={true}
                    expandRowByClick
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell className='footer' index={0}>4 Companies</Table.Summary.Cell>
                                <Table.Summary.Cell className='footer' index={1}></Table.Summary.Cell>
                                <Table.Summary.Cell className='footer' index={2} > </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )} />
            </div>
        </div>
    )
}
export default ProductTable