import React from 'react';
import WithdrawScreen from '@/containers/Withdraw/WithdrawScreen';
import MobileNavigatorMenu from '@/components/Menu/MobileNavigatorMenu';
import RedirectHeader from '@/components/RedirectHeader';
import ProfileWithdrawHistory from '@/containers/Withdraw/WithdrawHistory';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { redirect } from 'next/navigation';

interface PageProps {}

async function Page({}: PageProps) {
	const session = await getServerAuthSession();
	if (!session) {
		return redirect('/');
	}
	return (
		<>
			<MobileNavigatorMenu isShow={true} />
			<RedirectHeader redirectUrl={'/profile'} title={'Rút tiền'} />
			<WithdrawScreen />
			<ProfileWithdrawHistory />
		</>
	);
}

export default Page;
