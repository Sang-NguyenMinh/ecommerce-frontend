// components/Home/NewsletterSection.tsx
import React from 'react';
import { Button, Input, Form, Row, Col } from 'antd';
import { MailOutlined, GiftOutlined } from '@ant-design/icons';

const NewsletterSection: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Newsletter signup:', values);
    // Handle newsletter signup
    form.resetFields();
  };

  return (
    <section className="py-16 px-4 lg:px-8 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <GiftOutlined className="text-5xl mb-6 text-yellow-400" />
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Đăng Ký Nhận Ưu Đãi Đặc Biệt
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Nhận thông tin về sản phẩm mới, sale độc quyền và các ưu đãi hấp dẫn
        </p>

        <Form form={form} onFinish={onFinish} className="max-w-md mx-auto">
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={16}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nhập địa chỉ email của bạn"
                  prefix={<MailOutlined />}
                  className="h-12"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  block
                  className="h-12 bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-black font-semibold"
                >
                  Đăng Ký
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <p className="text-sm mt-4 opacity-75">
          * Bằng cách đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách
          bảo mật của chúng tôi
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
