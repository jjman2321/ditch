// 2b · "Change" → "Which Netflix plan?" (design/v12 render 02b). The local
// plans with their prices; the default is the most common one. "Enter my
// own price" hands over to the price sheet.

import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';

import { priceRow, defaultPlan } from '@/catalog/prices';
import { shortPlanName } from '@/domain/copy';
import { CYCLE_SHORT, CYCLE_WORDS } from '@/domain/money';
import { useMoney, type Picked } from '@/state/onboarding';
import { Button, Card, F, LogoTile, Radio, Sheet, Txt, haptic, usePalette } from '@/ui/sunflower';

import { CloseButton } from './Parts';

function Body({ pick, onPick, onClose, onOwnPrice }: { pick: Picked; onPick: (planId: string) => void; onClose: () => void; onOwnPrice: () => void }) {
  const p = usePalette();
  const money = useMoney();
  const row = priceRow(pick.id, pick.priceCountry);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  if (!row) return null;
  const common = shortPlanName(defaultPlan(row).name, pick.name);
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <LogoTile id={pick.id} size={40} />
        <Txt v="heading" accessibilityRole="header" style={{ flex: 1 }}>
          {`Which ${pick.name} plan?`}
        </Txt>
        <CloseButton onPress={onClose} />
      </View>
      <Card style={{ marginTop: 24 }}>
        <View accessibilityRole="radiogroup" accessibilityLabel={`${pick.name} plan`}>
          {row.plans.map((plan, i) => {
            const on = plan.id === pick.planId && pick.priceSource === 'catalog';
            const amount = money(plan.amountMinor, row.currency);
            const name = shortPlanName(plan.name, pick.name);
            return (
              <Pressable
                key={plan.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${name}, ${amount} ${CYCLE_WORDS[plan.cycle]}`}
                onPress={() => {
                  haptic.select();
                  onPick(plan.id);
                  // Let the tick land before the sheet goes.
                  timer.current = setTimeout(onClose, 220);
                }}
                style={({ pressed }) => ({ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, opacity: pressed ? 0.7 : 1 })}
              >
                {i ? <View style={{ position: 'absolute', top: 0, left: 52, right: 0, height: 1, backgroundColor: p.hair }} /> : null}
                <Radio on={on} />
                <Txt v="label" color={p.cardFg} style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}>
                  {name}
                </Txt>
                <Txt v="moneyS" num color={p.cardFg}>
                  {amount}
                  <Txt v="sub" tone="mute" style={{ fontFamily: F.medium }}>
                    {CYCLE_SHORT[plan.cycle]}
                  </Txt>
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </Card>
      <Txt v="sub" tone="mute" style={{ marginTop: 12 }}>
        {`Not sure? ${common} is the most common. You can change it later.`}
      </Txt>
      <Button kind="text" label="Enter my own price" onPress={onOwnPrice} style={{ marginTop: 16 }} />
    </View>
  );
}

export function PlanSheet({
  pick,
  visible,
  onClose,
  onPick,
  onOwnPrice,
}: {
  pick: Picked | null;
  visible: boolean;
  onClose: () => void;
  onPick: (planId: string) => void;
  onOwnPrice: () => void;
}) {
  return (
    <Sheet visible={visible && !!pick} onClose={onClose} fit gap={0} label={pick ? `${pick.name} plan` : 'Plan'}>
      {pick ? <Body key={pick.id} pick={pick} onPick={onPick} onClose={onClose} onOwnPrice={onOwnPrice} /> : null}
    </Sheet>
  );
}
