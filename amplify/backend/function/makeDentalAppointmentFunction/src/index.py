from decimal import Decimal
import json


def confirm_intent(message_content, intent_name, slots):
    return {
        'messages': [{'contentType': 'PlainText', 'content': message_content}],
        'sessionState': {
            'dialogAction': {
                'type': 'ConfirmIntent',
            },
            'intent': {
                'name': intent_name,
                'slots': slots,
                'state': 'Fulfilled'
            }
        }
    }


def close(fulfillment_state, message_content, intent_name, slots):
    return {
        'messages': [{'contentType': 'PlainText', 'content': message_content}],
        'sessionState': {
            'dialogAction': {
                'type': 'Close',
            },
            'intent': {
                'name': intent_name,
                'slots': slots,
                'state': fulfillment_state
            }
        }
    }


def elicit_slot(slot_to_elicit, intent_name, slots):
    return {
        'sessionState': {
            'dialogAction': {
                'type': 'ElicitSlot',
                'slotToElicit': slot_to_elicit,
            },
            'intent': {
                'name': intent_name,
                'slots': slots,
                'state': 'InProgress'
            }
        }
    }


def decimal_to_int(obj):
    if isinstance(obj, Decimal):
        return int(obj)


FIRST_SLOT = 'AppointmentType'
INTENT_NAME = 'MakeAppointment'


def router(event):
    # Lambda が起動された Intent 名を取得
    intent_name = event['sessionState']['intent']['name']

    # 想定外の Intent の場合は、なにもせず終了
    if intent_name != INTENT_NAME:
        return

    # sessionAttributes の nextSlot を取得。
    # sessionAttributes の nextSlot は、この Lambda 関数が処理するべき Slot が示されている。
    # Lambda 関数内で sesstionAttributes を設定すると、次に呼び出される Lambda 関数に引き継がれる。
    # 空白の場合は、この Intent が初めて呼びだされた実行なり、「Date」Slot を処理するべきものと識別する。(想定外なものがあるかもしれない)
    # if "nextSlot" in event['sessionState']['sessionAttributes']:
    #     nextSlot = event['sessionState']['sessionAttributes']['nextSlot']
    # else:
        # nextSlot = FIRST_SLOT

    # if nextSlot == FIRST_SLOT:
    #     slots = event["sessionState"]["intent"]["slots"]
    #     name = event["sessionState"]["intent"]["name"]


def handler(event, context):
    intent_name = event['sessionState']['intent']['name']
    slots = event['sessionState']['intent']['slots']
    confirmation_status = event['sessionState']['intent']['confirmationState']
    print("Received event:" + json.dumps(event, default=decimal_to_int, ensure_ascii=False))

    if confirmation_status == "Confirmed":
        return close("Fulfilled", 'ご予約ありがとうございました。当日の来院をお待ちしております。', intent_name, slots)
    return None
