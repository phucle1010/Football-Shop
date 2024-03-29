import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer } from 'react-toastify';
import notify from '../../../components/ToastMessage';

import styles from './CartItem.module.scss';

const cx = classNames.bind(styles);

function CartItem({
    cartDetailId,
    currentCart,
    quantity,
    product,
    sizeId,
    key,
    selectAllProducts,
    setSelectAllProducts,
    productBuyList,
    numberOfProduct,
}) {
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const [selectedProduct, setSelectedProduct] = useState(selectAllProducts);
    const [sizeName, setSizeName] = useState('');

    currentCart.map((item) => {
        if (item.detailId === cartDetailId) {
            item.shoesQuantity = currentQuantity;
        }
        return item;
    });

    useEffect(() => {
        axios
            .get('/products/size')
            .then((res) => {
                const sizeName = res.data.filter((item) => item.sizeId === sizeId)[0].sizeName;
                setSizeName(sizeName);
            })
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectAllProducts) {
            productBuyList.splice(0, productBuyList.length);
            setSelectedProduct(true);
        } else {
            if (!selectedProduct || productBuyList.length === numberOfProduct) {
                setSelectedProduct(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectAllProducts]);

    const handleRemoveShoes = () => {
        axios
            .post('/user/cart/remove', {
                detailId: cartDetailId,
            })
            .then((res) => {
                if (res.data.affectedRows > 0) {
                    notify('Đã xóa thành công 1 sản phẩn khỏi giỏ hàng', 'success', 2000);
                    setTimeout(() => window.location.reload(), 2100);
                }
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        const item = {
            cartDetailId,
            shoesId: product.shoesId,
            chosedSize: parseInt(sizeId) + 1,
            shoesQuantity: quantity,
            price: product.price,
        };

        if (selectedProduct) {
            productBuyList.push(item);
        } else {
            const unCheckedItem = productBuyList.filter((product) => product.cartDetailId === item.cartDetailId)[0];
            const removeIndex = productBuyList.indexOf(unCheckedItem);
            productBuyList.splice(removeIndex, 1);
            // setSelectAllProducts(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct]);

    const handleOnChangeChosedProduct = (e) => {
        if (!e.target.checked) {
            setSelectedProduct(false);
            setSelectAllProducts(false);
        } else {
            setSelectedProduct(true);
        }
    };
    // console.log(selectedProduct, '', selectAllProducts);

    return (
        <div key={key} className={cx('wrapper')}>
            <Container>
                <Row className={cx('product')}>
                    <Col className={cx('product-info-item')} xl={4}>
                        <input
                            type="checkbox"
                            className={cx('select-product')}
                            checked={selectedProduct || selectAllProducts}
                            onChange={(e) => handleOnChangeChosedProduct(e)}
                        />
                        <div className={cx('product-info')}>
                            <div className={cx('product-img')}>
                                <Link to={`/products/shoes/id/${product.shoesId}`}>
                                    <img src={product.mainImage} alt="" />
                                </Link>
                            </div>
                            <div className={cx('product-desc')}>
                                <span className={cx('product-name')}>{product.shoesName}</span>
                                <span className={cx('product-size')}>{sizeName}</span>
                            </div>
                        </div>
                    </Col>
                    <Col className={cx('product-info-item')} xl={2}>
                        <span className={cx('product-price')}>
                            {product.price.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </span>
                    </Col>
                    <Col className={cx('product-info-item')} xl={2}>
                        <div
                            className={cx('product-quantity-down')}
                            onClick={() => setCurrentQuantity((prev) => (prev > 0 ? prev - 1 : 0))}
                        >
                            -
                        </div>
                        <span className={cx('product-quantity')}>{currentQuantity}</span>
                        <div
                            className={cx('product-quantity-up')}
                            onClick={() => setCurrentQuantity((prev) => prev + 1)}
                        >
                            +
                        </div>
                    </Col>
                    <Col className={cx('product-info-item')} xl={2}>
                        <span className={cx('product-price-total')}>
                            {(product.price * currentQuantity).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </span>
                    </Col>
                    <Col className={cx('product-info-item')} xl={2}>
                        <span className={cx('remove-btn')} onClick={handleRemoveShoes}>
                            Xóa
                        </span>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </div>
    );
}

CartItem.prototype = {
    product: PropTypes.object.isRequired,
    key: PropTypes.number.isRequired,
    checked: PropTypes.bool.isRequired,
};

export default CartItem;
