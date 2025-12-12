import { StarFilled } from '@ant-design/icons';
import { Carousel } from 'antd';
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
        'Love this shirt! Fits perfectly and the fabric is thick without being stiff.',
      author: 'JonSnSF',
      productName: 'The Heavyweight Overshirt',
      productLink: '/product/heavyweight-overshirt',
      image:
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop',
    },
    {
      id: 2,
      rating: 5,
      review: 'Chất liệu cao cấp, thiết kế tinh tế. Đáng từng đồng bỏ ra!',
      author: 'MinhNguyen',
      productName: 'Premium Wool Coat',
      productLink: '/product/wool-coat',
      image:
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    },
    {
      id: 3,
      rating: 5,
      review:
        'Comfortable and stylish. Perfect for both casual and formal occasions.',
      author: 'AnhLe',
      productName: 'Classic Oxford Shirt',
      productLink: '/product/oxford-shirt',
      image:
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
    },
  ];

  const displayTestimonials = testimonials || defaultTestimonials;

  return (
    <section className="w-full py-12 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Carousel
          swipeToSlide={true}
          draggable={true}
          touchMove={true}
          autoplay
          dotPosition="bottom"
        >
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      People Are Talking
                    </p>

                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarFilled
                          key={i}
                          className="text-yellow-500 text-xl"
                        />
                      ))}
                    </div>

                    <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 leading-relaxed mb-6">
                      "{testimonial.review}"
                    </blockquote>

                    <div className="space-y-2">
                      <p className="text-gray-600">
                        -- {testimonial.author},{' '}
                        <a
                          href={testimonial.productLink}
                          className="text-gray-900 underline hover:text-gray-700 transition-colors font-medium"
                        >
                          {testimonial.productName}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100 aspect-[3/4] max-w-lg mx-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.productName}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <a
                        href={testimonial.productLink}
                        className="text-white font-semibold text-lg hover:underline"
                      >
                        {testimonial.productName}
                      </a>
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
