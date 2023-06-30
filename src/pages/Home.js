import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";

import '../Home.css';
import HomeBackground from '../img/home_bg.jpg'
import BhabiLogo from '../img/logo.svg'



import 'antd/dist/antd.css';
import { Col, Row, Button, Modal, Form, Input } from 'antd';
import { UserContext } from '../context/auth/userContext';

import { useAlert } from 'react-alert'



const Home = () => {

  const alert = useAlert()

  const { createRoom } = useContext(UserContext);

  const [Name, setName] = useState('');

  let userImage = `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${Name}`

  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('')
  

  // Join Room Popup
  const [visiblePopup, setVisiblePopup] = useState(false);
  const showModalPopup = () => {
    setVisiblePopup(true);
  };
  const handleOkPopup = () => {
    setVisiblePopup(false);
  };
  const handleCancelPopup = () => {
    setVisiblePopup(false);
  };



  const onFinishPopup = (values) => {
    createRoom(loginType, userImage, values.user_name, values.room_name, values.room_password).then((res) => {
      if (res.success) {
        navigate('/table');
      }
    });
  };

  const onFinishFailedPopup = (errorInfo) => {
    if (loginType === "join") {
      console.log('Join Room Failed:', errorInfo);
    }
    if (loginType === "create") {
      console.log('Create Room Failed:', errorInfo);
    }
  };


  return (
    <>
      <section className='home_wrrpr'>
        <div className='container'>
          <Row>
            <Col span={24} className="home_dv1">
              <div className='home_dv2' style={{ backgroundImage: `url(${HomeBackground})` }}>
                <div className='home_dv3'>
                  <div className='home_title'>
                    <img src={BhabiLogo} alt="logo" />
                  </div>
                  <ul className='home_buttons'>
                    <li>
                      <button className='btn' onClick={() => { showModalPopup(); setLoginType('join'); alert.show('Oh look, an alert!') }}>Join Room</button>
                    </li>
                    <li>
                      <button className='btn' onClick={() => { showModalPopup(); setLoginType('create') }}>Create Room</button>
                    </li>
                    <li><Link to="table" className='btn'>Table Page</Link></li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <Modal
        visible={visiblePopup}
        title={loginType === 'create' ? 'Create Room' : 'Join Room'}
        onOk={handleOkPopup}
        onCancel={handleCancelPopup}
        footer={null}
        className='popup_style1'
      >
        <Form
          name="basic"
          labelCol={{ span: 8, }}
          wrapperCol={{ span: 16, }}
          initialValues={{ remember: false, }}
          onFinish={onFinishPopup}
          onFinishFailed={onFinishFailedPopup}
          autoComplete="off"
        >

          <div className="myform_bb_uploader">

            <label htmlFor="profile_image_uploader">
              <img src={userImage} alt="User" />
            </label>
          </div>
          <Form.Item
            className='input_field_dv'
            label="Your Name"
            name="user_name"
            rules={[
              {
                required: true,
                message: 'Please enter your name!',
              },
            ]}
          >
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item
            className='input_field_dv'
            label="Room Name"
            name="room_name"
            rules={[
              {
                required: true,
                message: 'Please enter your room number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className='input_field_dv'
            label="Room Password"
            name="room_password"
            rules={[
              {
                required: true,
                message: 'Please enter your room password!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className='modal_foter'>
            <Button type="primary" htmlType="submit"> {loginType === 'create' ? 'Create Room' : 'Join Room'} </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default Home