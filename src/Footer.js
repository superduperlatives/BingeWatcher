import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="wrapper footerStyling">
                    <div className="subFooterStyling subFooterH2">
                        <div className="footerTextInlineBlock"><h2 className="footerH2">Team SuperDuperLatives:</h2></div>
                        <div className="footerTextInlineBlock textH2"><a href="https://github.com/superduperlatives/BingeWatcher.git">Andrea Maille, Brian Kan, Jeff Yeung, Tommy Lay</a></div>
                    </div>

                    <div className="subFooterStyling subFooterLinks">
                        <div className="footerTextInlineBlock"><h2 className="footerH2">Powered By API :</h2></div>
                        <div className="footerTextInlineBlock textH2"><a href="http://www.tvmaze.com/api">TVMAZE</a></div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;