import classNames from 'classnames/bind';
import axios from 'axios';
import PropTypes from 'prop-types';

import styles from './AddressItem.module.scss';

const cx = classNames.bind(styles);

function AddressItem({
    index,
    user,
    addressInfo,
    addressDetail,
    ward,
    district,
    province,
    defaultAddress,
    setChangeDefaultAddress,
}) {
    const handleChangeDefaultAddres = () => {
        axios
            .post('/user/address/default', {
                userId: user.userId,
                addressId: addressInfo.addressId,
            })
            .then((res) => {
                if (res.data.affectedRows > 0) {
                    alert('cập nhật địa chỉ mặc định thành công');
                    setChangeDefaultAddress(true);
                    window.location.reload();
                }
            });
    };
    return (
        <div key={index} className={cx('wrapper')}>
            <div className={cx('personal-info')}>
                <span className={cx('personal-name')}>{user.fullName}</span>
                <span className={cx('personal-phone')}>{user.phone}</span>
            </div>
            {user.roleAccess.data[0] === 0 ? (
                <>
                    <div className={cx('address-detail')}>
                        <span>{`${addressDetail}, ${ward}`}</span>
                    </div>
                    <div className={cx('address-detail')}>
                        <span>{`${district}, ${province}`}</span>
                    </div>
                </>
            ) : (
                <div className={cx('address-detail')}>
                    <span>{`${province}`}</span>
                </div>
            )}

            {user.roleAccess.data[0] === 0 && defaultAddress === 1 && (
                <span className={cx('address-default')}>Mặc định</span>
            )}

            {user.roleAccess.data[0] === 0 && defaultAddress === 0 && (
                <button className={cx('btn-set-address-default')} onClick={handleChangeDefaultAddres}>
                    Cài mặc định
                </button>
            )}
        </div>
    );
}

AddressItem.prototype = {
    defaultItem: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
};

export default AddressItem;
