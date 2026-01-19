import { ChevronLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';

InfoTitle.propTypes = {
    text: PropTypes.string,
    onBack: PropTypes.func,
    isBack: PropTypes.bool,
    isSelected: PropTypes.bool,
    type: PropTypes.string,
};

InfoTitle.defaultProps = {
    text: '',
    onBack: null,
    isBack: false,
    isSelected: false,
    type: '',
};

function InfoTitle(props) {
    const { text, onBack, isBack, isSelected, type } = props;

    const handleOnClick = () => {
        if (onBack) {
            if (type === 'broadcast') {
                onBack();
            } else {
                onBack(0);
            }
        }
    };

    const handleSelect = () => { };
    return (
        <div className="info_title">
            {isBack && (
                <div className="back-icon" onClick={handleOnClick}>
                    <ChevronLeft className="w-5 h-5" />
                </div>
            )}

            <span>{text}</span>
        </div>
    );
}

export default InfoTitle;
