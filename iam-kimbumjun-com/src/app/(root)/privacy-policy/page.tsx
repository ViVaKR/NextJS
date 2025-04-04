import styles from './PrivacyPolicy.module.css';


export default function PrivacyPolicy() {

    return (
        <>
            <div className={`${styles.privacyPolicy}`}>
                <h1>고객정보 보호 안내</h1>
                <p>고객님의 개인정보 보호를 위해 다음과 같은 정책을 시행하고 있습니다.</p>

                <h2>1. 개인정보 수집 목적</h2>
                <p>고객님의 개인정보는 서비스 제공 및 개선을 위해 수집됩니다.</p>

                <h2>2. 개인정보 수집 항목</h2>
                <p>코드 작성에 필요한 필명(가명)과 실제 사용중인 이메일만을 서비스 제공에 필요한 최소한의 정보만을 수집합니다.</p>

                <h2>3. 개인정보 이용</h2>
                <p>수집된 개인정보는 고객님께 더 나은 서비스를 제공하기 위해 사용됩니다.</p>

                <h2>4. 개인정보 보호</h2>
                <p>고객님의 개인정보는 암호화되어 안전하게 보호됩니다.</p>

                <h2>5. 개인정보 제공</h2>
                <p>고객님의 동의 없이 제3자에게 제공되지 않습니다.</p>

                <h2>6. 개인정보 보유 및 이용 기간</h2>
                <p>고객님의 개인정보는 서비스 제공 기간 동안 보유되며, 이후 안전하게 파기됩니다.</p>

                <h2>7. 개인정보 파기</h2>
                <p>고객님의 개인정보는 보유 기간이 종료된 후 안전하게 파기됩니다.</p>

                <h2>8. 개인정보 보호를 위한 기술적/관리적 대책</h2>
                <p>고객님의 개인정보를 보호하기 위해 다양한 기술적/관리적 대책을 시행하고 있습니다.</p>

                <h2>9. 개인정보 관련 문의</h2>
                <p>개인정보 보호와 관련된 문의사항은 고객센터로 연락해주시기 바랍니다. 이메일:
                    <a href="mailto:iam@kimbumjun.com">개인정보담당자</a>
                </p>
            </div>

        </>
    );
}
