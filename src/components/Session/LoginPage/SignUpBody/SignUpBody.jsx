import React from 'react';
import PropTypes from 'prop-types';
import SignUpPreview from './SignUpPreview/SignUpPreview';
import HardwareWalletLoginLink from '../Common/HardwareWalletLoginLink/HardwareWalletLoginLink';
import SignUpGenerateKeyPair from './SignUpGenerateKeyPair/SignUpGenerateKeyPair';
import LoginPageBody from '../LoginPageBody/LoginPageBody';
import Driver from '../../../../lib/Driver';

export default class SignUpBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signUpStep: 'preview',
        };
    }

    getSignUpBody() {
        const { signUpStep } = this.state;
        switch (signUpStep) {
        case 'preview': {
            return (
                <React.Fragment>
                    <div className="SignUpBody">
                        <SignUpPreview nextStep={() => this.setSignUpStep('generateKeyPair')} />
                    </div>
                    <HardwareWalletLoginLink narrow wallet={'lobstr'} />
                    <HardwareWalletLoginLink narrow wallet={'freighter'} />
                    <HardwareWalletLoginLink narrow wallet={'ledger'} />
                    <HardwareWalletLoginLink narrow wallet={'trezor'} />
                </React.Fragment>
            );
        }
        case 'generateKeyPair': {
            return (
                <React.Fragment>
                    <div className="SignUpBody">
                        <SignUpGenerateKeyPair
                            nextStep={() => this.setSignUpStep('finish')}
                            prevStep={() => this.setSignUpStep('preview')} />
                    </div>
                </React.Fragment>
            );
        }
        case 'finish': {
            return (
                <React.Fragment>
                    <div className="islandBack--t islandBack">
                        <div className="LoginPage island">
                            <LoginPageBody
                                d={this.props.d}
                                verifySignUp
                                prevSignUpStep={() => this.setSignUpStep('generateKeyPair')} />
                        </div>
                    </div>
                </React.Fragment>
            );
        }
        default: return null;
        }
    }

    setSignUpStep(signUpStep) {
        this.setState({ signUpStep });
    }

    render() {
        const body = this.getSignUpBody();
        return (
            <React.Fragment>
                {body}
            </React.Fragment>
        );
    }
}
SignUpBody.propTypes = {
    d: PropTypes.instanceOf(Driver),
};
