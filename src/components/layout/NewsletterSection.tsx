import React from 'react';
import { Button, Input, Form, Row, Col } from 'antd';
import { MailOutlined, GiftOutlined } from '@ant-design/icons';

const NewsletterSection: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Newsletter signup:', values);
    form.resetFields();
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r !from-gray-900 !to-black !text-white">
      <div className="max-w-4xl mx-auto text-center">
        <GiftOutlined className="text-4xl sm:text-5xl mb-4 sm:mb-6 !text-yellow-400" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">
          Đăng Ký Nhận Ưu Đãi Đặc Biệt
        </h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 px-4">
          Nhận thông tin về sản phẩm mới, sale độc quyền và các ưu đãi hấp dẫn
        </p>

        <Form
          form={form}
          onFinish={onFinish}
          className="max-w-md !mx-auto px-4"
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={16}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
                className="!mb-0"
              >
                <Input
                  size="large"
                  placeholder="Nhập email của bạn"
                  prefix={<MailOutlined />}
                  className="!h-12"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  block
                  className="!h-12 !bg-yellow-500 hover:!bg-yellow-600 !border-yellow-500 !text-black font-semibold"
                >
                  Đăng Ký
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <p className="text-xs sm:text-sm mt-4! sm:mt-6  opacity-75 px-4 leading-relaxed">
          * Bằng cách đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách
          bảo mật của chúng tôi
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
