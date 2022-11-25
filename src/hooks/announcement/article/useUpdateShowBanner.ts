import { API } from 'api';
import { SHOW_BANNER } from 'hooks/announcement/constants';
import { useMutation } from 'react-query';
import { config } from '../config';

export const updateShowBanner = (bannerId: number, isShow: boolean) => {
  return API.patch(config)(`/admin/banner/show/banner_id=${bannerId}`, {
    show: isShow,
  });
};

export const useUpdateShowBanner = () => {
  const mutation = useMutation(
    [SHOW_BANNER],
    (body: { id: number; show: boolean }) => {
      return updateShowBanner(body.id, body.show);
    }
  );
  return mutation;
};
