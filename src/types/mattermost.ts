export type UserNotifyProps = {
  email: string;
  push: string;
  desktop: string;
  desktop_sound: string;
  mention_keys: string;
  channel: string;
  first_name: string;
};
export type Timezone = {
  useAutomaticTimezone: string;
  manualTimezone: string;
  automaticTimezone: string;
};

export type MMUserData = {
  id: string;
  create_at: number;
  update_at: number;
  delete_at: number;
  username: string;
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  email_verified?: boolean;
  auth_service: string;
  auth_data: string;
  roles: string;
  locale: string;
  notify_props?: UserNotifyProps;
  props: {};
  last_password_update?: number;
  last_picture_update?: number;
  failed_attempts?: number;
  mfa_active?: boolean;
  timezone: Timezone;
  terms_of_service_id?: string;
  terms_of_service_create_at?: number;
  position: string;
  is_bot?: boolean;
  bot_description?: string;
  disable_welcome_email?: boolean;
};
