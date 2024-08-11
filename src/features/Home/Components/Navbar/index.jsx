import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Nav, Select, Button } from '@douyinfe/semi-ui';
import {
    IconStar,
    IconSetting,
    IconGlobe,
    IconLanguage,
} from '@douyinfe/semi-icons';
function Navbar() {
    const history = useHistory();
    const [isShowMenu, setIsShowMenu] = useState(false);

    return (
        <header>
            <Nav
                mode={'horizontal'}
                header={{
                    logo: (
                        <img
                            src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg"
                            alt="logo"
                        />
                    ),
                    text: 'MEETDY',
                }}
                renderWrapper={({ itemElement, props }) => {
                    const routerMap = {
                        home: "/",
                        features: '/features',
                        privatepolicy: '/private-policy',
                    };
                    return (
                        <Link
                            style={{ textDecoration: "none" }}
                            to={routerMap[props.itemKey]}
                        >
                            {itemElement}
                        </Link>
                    );
                }}
                items={[
                    {
                        itemKey: 'features',
                        text: 'Tính năng',
                        icon: <IconStar />,
                    },
                    {
                        itemKey: 'privatepolicy',
                        text: 'Quyền riêng tư',
                        icon: <IconGlobe />,
                    },
                    {
                        itemKey: 'platform',
                        text: 'Nền tảng ứng dụng',
                        icon: <IconSetting />,
                        items: [
                            'Mobile Application',
                            'Website'
                        ],
                    },
                ]}

                onSelect={(key) => console.log(key)}

                footer={
                    <>
                        <Select
                            defaultValue="English"
                            style={{ width: 150, marginRight: 10 }}
                            insetLabel={<IconLanguage />}
                        >
                            <Select.Option value="vn-VI">
                                Việt Nam
                            </Select.Option>
                            {/* <Select.Option value="en-EN">English</Select.Option> */}
                        </Select>
                        <Button onClick={() => history.push('/account/login')} style={{ marginRight: 10 }}>
                            Đăng nhập / Đăng ký
                        </Button>
                    </>
                }
            />
        </header>
    );
}

export default Navbar;
