/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Menu, Icon, Layout, Badge, Popover,Button,message, Modal,Form,  Input,  Checkbox } from 'antd';
import screenfull from 'screenfull';
import { gitOauthToken, gitOauthInfo } from '../axios';
import { queryString } from '../utils';
import avater from '../style/imgs/b1.jpg';
import SiderCustom from './SiderCustom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link,hashHistory,browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const FormItem = Form.Item;

class HeaderCustom extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: '',
            visible: false,
        }
    }
    componentWillMount() {
        const { receiveData } = this.props;
        receiveData(null, 'auth');
    }
    componentDidMount() {
        const QueryString = queryString();
        // if (QueryString.hasOwnProperty('code')) {
        //     console.log(QueryString);
        //     const _user = JSON.parse(localStorage.getItem('user'));
        //     !_user && gitOauthToken(QueryString.code).then(res => {
        //         console.log(res);
        //         gitOauthInfo(res.access_token).then(info => {
        //             this.setState({
        //                 user: info
        //             });
        //             localStorage.setItem('user', JSON.stringify(info));
        //         });
        //     });
        //     _user && this.setState({
        //         user: _user
        //     });
        // }
        const _user = JSON.parse(localStorage.getItem('user')) || '测试';
        if (!_user && QueryString.hasOwnProperty('code')) {
            gitOauthToken(QueryString.code).then(res => {
                gitOauthInfo(res.access_token).then(info => {
                    this.setState({
                        user: info
                    });
                    localStorage.setItem('user', JSON.stringify(info));
                });
            });
        } else {
            this.setState({
                user: _user
            });
        }
    };
    componentWillReceiveProps(nextProps) {
        const { auth: nextAuth = {} } = nextProps;
        const { history } = this.props;
        if (nextAuth.data && nextAuth.data.uid) {   // 判断是否登陆
            console.log('nextAuth.data');
            console.log(nextAuth.data);
            if(nextAuth.data.uid == 1){
                localStorage.setItem('user', JSON.stringify(nextAuth.data));
                browserHistory.push(`/#/app/admin/adminHome`);
                window.location.reload();
            }else{
                localStorage.setItem('user', JSON.stringify(nextAuth.data));
                browserHistory.push(`/`);
                window.location.reload();
            } 
        } 
        
    }
    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.request();
        }

    }
    menuClick = e => {
        console.log(e);
        e.key === 'logout' && this.logout();
        e.key === 'login' && this.showModal();
    }
    showModal = () => {
        console.log('showModal');
        this.setState({
          visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
          visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
    }
    logout = () => {
        console.log('logout');
        localStorage.removeItem('user');
        this.props.history.push('/')
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { fetchData } = this.props;
                if (values.userName === 'admin' && values.password === 'admin'){
                    fetchData({funcName: 'admin', stateName: 'auth'});
                    message.success("管理员登录成功");
                }
                if (values.userName === 'guest' && values.password === 'guest'){
                    fetchData({funcName: 'guest', stateName: 'auth'});
                    message.success("用户登录成功");
                }
            }
        });
        this.setState({
            visible: false,
        });
    };
    gitHub = () => {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin';
    };
    render() {
        const { responsive, path } = this.props;
        console.log('this.state');
        console.log(this.state);
        const { getFieldDecorator } = this.props.form;
        return (
            <Header style={{ background: '#fff', padding: 0, height: 65 }} className="custom-theme" >
                {
                    responsive.data.isMobile ? (
                        <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                            <Icon type="bars" className="trigger custom-trigger" />
                        </Popover>
                    ) : (
                        <Icon
                            className="trigger custom-trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                        />
                    )
                }
                <Menu mode="horizontal" style={{ lineHeight: '64px', float: 'right' }} onClick={this.menuClick}>
                    <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>
                    <Menu.Item key="name" >
                        <span>{this.state.user.userName}</span>
                    </Menu.Item>
                    <SubMenu title={
                        <span className="avatar">
                        {
                            this.state.user.userName?<span><img src={avater} alt="头像" /><i className="on bottom b-white" /></span>:<span>未登录</span>
                        }
                        </span>
                    }>
                        <MenuItemGroup title="用户中心">
                            {/*<Menu.Item key="setting:1">你好 - {this.props.user.userName}</Menu.Item>
                            <Menu.Item key="setting:2">个人信息</Menu.Item>*/}
                            
                            {
                                this.state.user.userName&&
                                <Menu.Item key="logout"><span>退出登录</span></Menu.Item>
                            }
                            {
                                !this.state.user.userName&&
                                <Menu.Item key="login"><span>登录</span></Menu.Item>
                            }
                        </MenuItemGroup>
                        {/*<MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup>*/}
                    </SubMenu>
                </Menu>
                
                <Modal title="登录" footer={null} style={{maxWidth: '400px'}} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} >
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                <a href="">或 现在就去注册!</a>
                                {/*<a onClick={this.gitHub} ><Icon type="github" />(第三方登录)</a>*/}
                            </p>
                        </FormItem>
                    </Form>
                </Modal>
                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
            </Header>
            
        )
    }
}

const mapStateToProps = state => {
    const { responsive = {data: {}} } = state.httpData;
    const { auth } = state.httpData;
    return {responsive,auth};
};

const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(HeaderCustom)));
