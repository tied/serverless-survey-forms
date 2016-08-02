
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import IconButton from '../../IconButton';
import Qustom from '../../../../../src/index';

class Preview extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = {
            previewType: `${props.preview}Icon`
        };

        this._btnClickEvent = this._btnClickEvent.bind(this);
        this._onChangePreviewType = this._onChangePreviewType.bind(this);
    }

    render() {
        const { account, previewID, preview } = this.props;
        const { previewType } = this.state;
        const type = preview === 'embedded' ? preview : 'preview';
        let buttons = [];
        ['embeddedIcon', 'previewPhoneIcon', 'previewPadIcon', 'previewDesktopIcon'].
            forEach((btn, idx) => {
                buttons.push(
                    <IconButton
                        key={idx}
                        id={`preview${idx}Btn`}
                        i18nKey={false}
                        img={btn}
                        selected={previewType === btn}
                        onClick={this._onChangePreviewType}
                        extraProps={{ 'data-type': btn }}
                    />);
            });
        let qustom;
        if (preview === 'embedded') {
            qustom = (
                <div className={styles.embedded}>
                    <div className={`${styles.preview} ${styles[preview]}`}>
                        <Qustom
                            accountid={account.accountid}
                            surveyid={previewID}
                            type={type}
                            localize_path="../../../../../assets/L10N"
                        />
                    </div>
                </div>
            );
        } else {
            qustom = (<div className={`${styles.preview} ${styles[preview]}`}>
                <Qustom
                    accountid={account.accountid}
                    surveyid={previewID}
                    type={type}
                    localize_path="../../../../../assets/L10N"
                />
            </div>);
        }

        return (
            <div className={styles.popup}>
                <div className={styles.wrap}>
                    <button
                        type="button"
                        onClick={this._btnClickEvent}
                        className={`${styles.close} close`}
                        data-type="cancel"
                    >×
                    </button>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <div className={styles.title}>Preview</div>
                            <div className={styles.control}>
                                {buttons}
                            </div>
                        </div>
                        {qustom}
                    </div>
                </div>
            </div>
        );
    }

    _onChangePreviewType(e) {
        const { previewActions } = this.props;
        const type = e.currentTarget.getAttribute('data-type').replace('Icon', '');
        this.setState({
            previewType: e.currentTarget.getAttribute('data-type')
        });
        previewActions.changePreview(type);
    }

    _btnClickEvent() {
        const { previewActions } = this.props;
        previewActions.closePreview();
    }
}

export default Preview;