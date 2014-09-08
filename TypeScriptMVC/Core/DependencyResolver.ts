/// <reference path="Core.ts" />

module MVC {
    "use strict";

    export class DependencyDescriptor extends CoreObject {
        public constructor(private key: string, private value: any, private dependencyKeys: Array<string>) {
            super();
        }

        public get Key(): string {
            return this.key;
        }

        public get Value(): any {
            return this.value;
        }

        public get DependencyKeys(): Array<string> {
            return this.dependencyKeys;
        }

        public get IsConstructor(): boolean {
            return typeof this.value === "function";
        }
    }

    export interface IDependencyResolver {
        GetService: <TService>(key: string) => TService;
        RegisterInstance: (key: string, value: any) => IDependencyResolver;
        RegisterType: (key: string, value: any, ...args: Array<string>) => IDependencyResolver;
        IsRegistered: (key: string) => boolean;
    }

    export class DependencyResolverBase extends CoreObject implements IDependencyResolver {
        private static registry: IDictionary<string, DependencyDescriptor> = new Dictionary<string, DependencyDescriptor>();

        public GetService<TService>(key: string): TService {
            Args.IsNotNull(key, "key");

            if (!DependencyResolverBase.registry.Contains(key)) {
                throw new ArgumentOutOfRangeException("key");
            }

            var dep: DependencyDescriptor = DependencyResolverBase.registry.Get(key);

            if (dep.Key !== key) {
                throw new DependencyResolverException("Dependency failed verification.");
            }

            if (dep.IsConstructor) {
                if (Args.IsNull(dep.DependencyKeys)) {
                    return new dep.Value();
                } else {
                    var args: Array<any> = this.ParseArgs.call(this, dep.DependencyKeys);

                    var item: any = this.Instantiate(dep.Value, args);

                    return item;
                }
            }

            return dep.Value;
        }

        public RegisterInstance(key: string, value: any): IDependencyResolver {
            Args.IsNotNull(key, "key");
            Args.IsNotNull(value, "value");

            if (typeof value === "function") {
                throw new ArgumentException("value", "The {0} parameter is of type 'function'. Please use RegisterType instead.");
            }

            this.RegisterInternal(key, value, null);

            return this;
        }

        public RegisterType(key: string, value: any, ...dependencyKeys: Array<string>): IDependencyResolver {
            Args.IsNotNull(key, "key");
            Args.IsNotNull(value, "value");

            this.RegisterInternal(key, value, dependencyKeys);

            return this;
        }

        public IsRegistered(key: string): boolean {
            return DependencyResolverBase.registry.Contains(key);
        }

        private RegisterInternal(key: string, value: any, dependencyKeys: Array<string>): void {
            var dep: DependencyDescriptor = new DependencyDescriptor(key, value, dependencyKeys);

            DependencyResolverBase.registry.Add(key, dep);
        }

        private Invoke(fn: Function, self: Object, args: Array<any>): any {
            return fn.apply(self, args);
        }

        private Instantiate(Type: Function, args: Array<any>): any {
            var Constructor: any = function (): any { return; },
                instance: any, returnedValue: any;

            Constructor.prototype = Type.prototype;
            instance = new Constructor();
            returnedValue = this.Invoke(Type, instance, args);

            return typeof returnedValue === "function" || typeof returnedValue === "object" ? returnedValue : instance;
        }

        private ParseArgs(dependencyKeys: Array<string>): Array<any> {
            var values: Array<any> = new Array<any>(),
                i: number = 0,
                key: string = "";

            if (!Args.IsNull(dependencyKeys) && dependencyKeys.length > 0) {
                for (i; i < dependencyKeys.length; i++) {
                    key = dependencyKeys[i];

                    if (!Args.IsNull(key) && key !== "") {
                        values[i] = this.GetService<any>(dependencyKeys[i]);
                    }
                }

                return values;
            } else {
                return dependencyKeys;
            }
        }
    }

    export class DependencyResolver extends DependencyResolverBase {
        private static resolver: IDependencyResolver = new DependencyResolver();

        static SetResolver(resolver: IDependencyResolver): void {
            DependencyResolver.resolver = resolver;
        }

        static get Current(): IDependencyResolver {
            return DependencyResolver.resolver;
        }
    }

    export class DependencyResolverException extends CoreException {
    }
}