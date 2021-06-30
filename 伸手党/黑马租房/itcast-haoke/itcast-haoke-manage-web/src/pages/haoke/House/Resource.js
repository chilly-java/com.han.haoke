import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ houseResource, loading }) => ({
  houseResource,
  loading: loading.models.houseResource,
}))
@Form.create()
class Resource extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '房源编号',
      dataIndex: 'name',
    },
    {
      title: '房源信息',
      dataIndex: 'desc',
    },
    {
      title: '图',
      dataIndex: 'pic'
    },
    {
      title: '委托人',
      dataIndex: 'status'
    },
    {
      title: '委托时间',
      dataIndex: 'updatedAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '咨询量',
      dataIndex: 'status'
    },
    {
      title: '看房量',
      dataIndex: 'status'
    },
    {
      title: '状态',
      dataIndex: 'status'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>查看详情</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() { //当组件挂载完成后执行加载数据
    console.log("loading.......");
    const { dispatch } = this.props;
    dispatch({
      type: 'houseResource/fetch',
      // type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };




  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 5, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
              {getFieldDecorator('name')(<Input placeholder="区域" />)}
          </Col>
          <Col md={4} sm={24}>
              {getFieldDecorator('name')(<Input placeholder="楼盘名称" />)}
          </Col>
          <Col md={4} sm={24}>
              {getFieldDecorator('status')(
                <Select placeholder="房屋类型" style={{ width: '100%' }}>
                  <Option value="0">住宅</Option>
                  <Option value="1">商住两用</Option>
                </Select>
              )}
          </Col>
          <Col md={4} sm={24}>
              {getFieldDecorator('name')(<Input placeholder="户型" />)}
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('name')(<Input placeholder="区域" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
             {getFieldDecorator('name')(<Input placeholder="楼盘名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('status')(
                  <Select placeholder="房屋类型" style={{ width: '100%' }}>
                    <Option value="0">住宅</Option>
                    <Option value="1">商住两用</Option>
                  </Select>
                )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
             {getFieldDecorator('name')(<Input placeholder="户型" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('name')(<Input placeholder="房源编号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <Row>
              <Col md={10} sm={24}>
                <FormItem label="">
                  {getFieldDecorator('name')(<Input placeholder="价格" />)}
                </FormItem>
              </Col>
              <Col md={4} sm={24}>
                <div style={{textAlign:'center'}}>到</div>
              </Col>
              <Col md={10} sm={24}>
                <FormItem label="">
                  {getFieldDecorator('name')(<Input placeholder="价格" />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
            {getFieldDecorator('name')(<Input placeholder="朝向" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
             {getFieldDecorator('name')(<Input placeholder="装修" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      houseResource: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    console.log(this.props);

    return (
      <PageHeaderWrapper title="房源管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Resource;
