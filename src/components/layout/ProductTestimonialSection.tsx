import { StarFilled } from '@ant-design/icons';
import { Carousel } from 'antd';
import Link from 'next/link';

interface Testimonial {
  id: number;
  rating: number;
  review: string;
  author: string;
  productName: string;
  productLink: string;
  image: string;
}

interface ProductTestimonialSectionProps {
  testimonials?: Testimonial[];
}

const ProductTestimonialSection: React.FC<ProductTestimonialSectionProps> = ({
  testimonials,
}) => {
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      rating: 5,
      review:
        'Rất thích chiếc áo này! Form vừa vặn hoàn hảo, chất vải dày dặn nhưng không hề cứng.',
      author: 'SonTran',
      productName: 'Áo Khoác Dáng Rộng Heavyweight',
      productLink: '/product/heavyweight-overshirt',
      image:
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop',
    },
    {
      id: 2,
      rating: 5,
      review:
        'Chất liệu cao cấp, thiết kế tinh tế. Hoàn toàn xứng đáng với số tiền bỏ ra!',
      author: 'MinhNguyen',
      productName: 'Áo Khoác Dạ Len Cao Cấp',
      productLink: '/product/wool-coat',
      image:
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    },
    {
      id: 3,
      rating: 5,
      review:
        'Thoải mái và rất thời trang. Phù hợp cho cả đi làm lẫn những dịp thường ngày.',
      author: 'AnhLe',
      productName: 'Áo Sơ Mi Oxford Cổ Điển',
      productLink: '/product/oxford-shirt',
      image:
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
    },
  ];

  const displayTestimonials = testimonials || defaultTestimonials;

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 xl:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          swipeToSlide={true}
          draggable={true}
          touchMove={true}
          autoplay
          dotPosition="bottom"
        >
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="pb-8 sm:pb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
                <div className="order-2 lg:order-1 space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-0">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                      Khách Hàng Nói Gì
                    </p>

                    <div className="flex gap-1 mb-4 sm:mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarFilled
                          key={i}
                          className="text-yellow-500 text-base sm:text-lg lg:text-xl"
                        />
                      ))}
                    </div>

                    <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed mb-4 sm:mb-6">
                      "{testimonial.review}"
                    </blockquote>

                    <div className="space-y-2">
                      <p className="text-sm sm:text-base text-gray-600">
                        -- {testimonial.author},{' '}
                        <Link
                          href={testimonial.productLink}
                          className="text-gray-900 underline hover:text-gray-700 transition-colors font-medium"
                        >
                          {testimonial.productName}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl bg-gray-100 aspect-[3/4] max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.productName}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                      <Link
                        href={testimonial.productLink}
                        className="text-white! font-semibold text-base sm:text-lg hover:underline block"
                      >
                        {testimonial.productName}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default ProductTestimonialSection;
