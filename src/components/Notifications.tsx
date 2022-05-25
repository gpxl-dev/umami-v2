import React from 'react'
import NotificationsSystem, {
	atalhoTheme,
	setUpNotifications,
	useNotifications,
} from 'reapop'

export default function Notifications() {
	const { notifications, dismissNotification } = useNotifications()

	const [isInitialized, setInitialized] = React.useState(false)

	const initializeNotifications = React.useCallback(() => {
		if (isInitialized) {
			return
		}

		setUpNotifications({
			defaultProps: {
				position: 'top-right',
				dismissable: true,
			},
		})

		setInitialized(true)
	}, [isInitialized, setUpNotifications])

	React.useEffect(initializeNotifications, [initializeNotifications])

	return (
		<NotificationsSystem
			notifications={notifications}
			dismissNotification={(id) => dismissNotification(id)}
			theme={atalhoTheme}
		/>
	)
}
