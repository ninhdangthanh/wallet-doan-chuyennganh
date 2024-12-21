
CREATE TABLE public.users (
    id serial4 NOT NULL,
    email varchar(255) NULL,
    "password" varchar(255) NULL,
    temporary_password varchar(255) NULL,
    temporary_password_expired int8 NULL,
    verified bool NULL,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);


CREATE TABLE public.accounts (
    id serial4 NOT NULL,
    "name" varchar(255) NULL,
    "privateKey" varchar(255) NULL,
    address varchar(255) NULL,
    balance float8 NULL,
    user_id int4 NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT accounts_name_user_id_key UNIQUE (name, user_id),
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_accounts_users FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE SET NULL
);

CREATE TABLE public.activities (
    id serial4 NOT NULL,
    tx_hash varchar(255) NULL,
    "from" varchar(255) NULL,
    "to" varchar(255) NULL,
    amount varchar(255) NULL,
    erc20_name varchar(255) NULL,
    erc20_symbol varchar(255) NULL,
    nonce int4 NULL,
    status varchar(255) NULL,
    account_id int4 NULL,
    user_id int4 NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT activities_pkey PRIMARY KEY (id),
    CONSTRAINT fk_activities_accounts FOREIGN KEY (account_id) REFERENCES public.accounts (id) ON DELETE CASCADE,
    CONSTRAINT fk_activities_users FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);


CREATE TABLE public.erc20_tokens (
    id serial4 NOT NULL,
    "name" varchar(255) NULL,
    contract_address varchar(255) NULL,
    symbol varchar(255) NULL,
    "decimal" int4 NULL,
    balance float8 NULL,
    account_id int4 NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT erc20_tokens_contract_address_account_id_key UNIQUE (contract_address, account_id),
    CONSTRAINT erc20_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT fk_erc20_tokens_accounts FOREIGN KEY (account_id) REFERENCES public.accounts (id) ON DELETE CASCADE
);


CREATE TABLE public.latest_block_infos (
    id serial4 NOT NULL,
    block_number int4 NULL,
    miner varchar(255) NULL,
    gas_used varchar(255) NULL,
    transaction_count int4 NULL,
    block_mined_at varchar(255) NULL,
    time_between_blocks varchar(255) NULL,
    CONSTRAINT latest_block_infos_pkey PRIMARY KEY (id)
);


CREATE TABLE public.txs_analytics (
    id serial4 NOT NULL,
    tx_hash varchar(255) NULL,
    balance varchar(255) NULL,
    gas varchar(255) NULL,
    block_number varchar(255) NULL,
    CONSTRAINT txs_analytics_pkey PRIMARY KEY (id)
);
