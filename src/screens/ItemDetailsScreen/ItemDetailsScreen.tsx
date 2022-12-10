import React from 'react';
import {Image, View} from 'react-native';
import {Button, Divider, Icon, IconProps, Text} from '@ui-kitten/components';
import {Bubble, Gutter, Space} from '../../components';
import {useStrings, variance} from '../../core';
import StepList, {Step} from './StepList';
import {range} from 'lodash';
import dayjs from 'dayjs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {Item} from '../../core/ItemRestClientHelper';

export type ItemDetailsScreenProps = {
  item: Item;
  onDeletePress: () => void;
};

// TODO l10n
export default function ItemDetailsScreen({
  item,
  onDeletePress,
}: ItemDetailsScreenProps) {
  const strings = useStrings();
  return (
    <RootView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['bottom']}>
          <ItemImage source={{uri: item.image}} />
          <Bubble>
            <Space gutter={Gutter.Middle}>
              <Space>
                <Space gutter={Gutter.Small}>
                  <Text category="h6">{item.name}</Text>
                  {item.serialNumber !== undefined && (
                    <Text appearance="hint" category="c1">
                      {strings['itemDetailsScreen.serialNumber']}{' '}
                      {item.serialNumber}
                    </Text>
                  )}
                  {item.customFields?.map((_, index) => (
                    <Text key={index} appearance="hint" category="c1">
                      {_.label}: {_.value}
                    </Text>
                  ))}
                </Space>
              </Space>
              <StepList steps={DATA} />
            </Space>
          </Bubble>
          <Divider />
          <Bubble>
            <Space>
              <Button
                status={item.qrKey ? 'basic' : 'primary'}
                accessoryLeft={QrIcon}>
                {item.qrKey
                  ? strings['itemDetailsScreen.replaceQrButton']
                  : strings['itemDetailsScreen.addQrButton']}
              </Button>
              <Button
                onPress={onDeletePress}
                status="danger"
                accessoryLeft={TrashIcon}>
                Delete
              </Button>
            </Space>
          </Bubble>
        </SafeAreaView>
      </ScrollView>
    </RootView>
  );
}

const QrIcon = (props: IconProps) => (
  <Icon name="qr" pack="assets" {...props} />
);

const TrashIcon = (props: IconProps) => (
  <Icon name="trash-outline" {...props} />
);

const DATA: Step[] = range(10).map(_ => ({title: 'Title_' + _, date: dayjs()}));

const RootView = variance(View)(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette['background-basic-color-1'],
  },
}));

const ItemImage = variance(Image)(theme => ({
  root: {
    height: 340,
    width: '100%',
    backgroundColor: theme.palette['background-basic-color-4'],
  },
}));
