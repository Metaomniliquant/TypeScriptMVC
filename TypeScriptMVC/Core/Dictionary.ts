/// <reference path="Core.ts" />
/// <reference path="Collections.ts" />

module MVC {
    "use strict";

    export interface IKeyValuePair<TKey, TValue> {
        Key: TKey;
        Value: TValue;
    }

    export interface IDictionary<TKey, TValue> {
        Keys: ICollection<TKey>;
        Values: ICollection<TValue>;
        Items: ICollection<IKeyValuePair<TKey, TValue>>;
        Contains: (key: TKey) => boolean;
        Add: (key: TKey, value: TValue) => IDictionary<TKey, TValue>;
        Remove: (key: TKey) => void;
        Get: (key: TKey) => TValue;
    }

    export class KeyValuePairBase<TKey, TValue> extends CoreObject implements IKeyValuePair<TKey, TValue> {
        public constructor(private key: TKey, private value: TValue) {
            super();
        }

        public get Key(): TKey {
            return this.key;
        }

        public get Value(): TValue {
            return this.value;
        }
    }

    export class KeyValuePair<TKey, TValue> extends KeyValuePairBase<TKey, TValue> {
    }

    export class DictionaryBase<TKey, TValue> extends CoreObject implements IDictionary<TKey, TValue> {
        private items: Collection<IKeyValuePair<TKey, TValue>>;
        public constructor() {
            super();

            this.items = new Collection<IKeyValuePair<TKey, TValue>>();
        }

        public Contains(key: TKey): boolean {
            Args.IsNotNull(key, "key");

            var keyIndex: number = this.Keys.IndexOf(key);

            return keyIndex > -1;
        }

        public Add(key: TKey, value: TValue): IDictionary<TKey, TValue> {
            Args.IsNotNull(key, "key");

            this.items.Add(new KeyValuePair(key, value));

            return this;
        }

        public Remove(key: TKey): void {
            var i: number = 0,
                removeMe: IKeyValuePair<TKey, TValue> = null;

            Args.IsNotNull(key, "key");

            var keyIndex: number = this.Keys.IndexOf(key);

            if (keyIndex <= -1) {
                throw new ArgumentOutOfRangeException("key");
            }

            for (i; i < this.items.Count; i++) {
                var kvp: IKeyValuePair<TKey, TValue> = this.items.Get(i);

                if (kvp.Key === key) {
                    removeMe = kvp;
                    break;
                }
            }

            this.items.Remove(removeMe);
        }

        public Get(key: TKey): TValue {
            var i: number = 0,
                getMe: IKeyValuePair<TKey, TValue> = null;

            Args.IsNotNull(key, "key");

            var keyIndex: number = this.Keys.IndexOf(key);

            if (keyIndex <= -1) {
                throw new ArgumentOutOfRangeException("key");
            }

            for (i; i < this.items.Count; i++) {
                var kvp: IKeyValuePair<TKey, TValue> = this.items.Get(i);

                if (kvp.Key === key) {
                    getMe = kvp;
                    break;
                }
            }

            return getMe.Value;
        }

        public get Keys(): ICollection<TKey> {
            var keys: ICollection<TKey> = new Collection<TKey>(),
                items: Array<IKeyValuePair<TKey, TValue>> = this.items.Items,
                i: number = 0;

            for (i; i < items.length; i++) {
                var kvp: IKeyValuePair<TKey, TValue> = items[i];

                keys.Add(kvp.Key);
            }

            return keys;
        }

        public get Values(): ICollection<TValue> {
            var values: ICollection<TValue> = new Collection<TValue>(),
                items: Array<IKeyValuePair<TKey, TValue>> = this.items.Items,
                i: number = 0;

            for (i; i < items.length; i++) {
                var kvp: IKeyValuePair<TKey, TValue> = items[i];

                values.Add(kvp.Value);
            }

            return values;
        }

        public get Items(): Collection<IKeyValuePair<TKey, TValue>> {
            return this.items;
        }
    }

    export class Dictionary<TKey, TValue> extends DictionaryBase<TKey, TValue> {
    }
}