







var assrts = `
lib/default-validator.js:  assert(config, 'config is not defined');
lib/default-validator.js:    assert(config.edge_config, 'config.edge_config is not defined');
lib/default-validator.js:    assert(config.edge_config.bootstrap, 'config.edge_config.bootstrap is not defined');
lib/default-validator.js:    assert(config.edge_config.jwt_public_key, 'config.edge_config.jwt_public_key is not defined');
lib/default-validator.js:      assert(typeof config.edge_config.retry_interval === 'number', 'config.edge_config.retry_interval is not a number');
lib/default-validator.js:        assert(config.edge_config.retry_interval >= 5000, 'config.edge_config.retry_interval is too small (min 5s)');
lib/default-validator.js:      assert(typeof config.edge_config.refresh_interval === 'number', 'config.edge_config.refresh_interval is not a number');
lib/default-validator.js:        assert(config.edge_config.refresh_interval >= 3600000, 'config.edge_config.refresh_interval is too small (min 1h)');
lib/default-validator.js:      assert(proxy_url.protocol === 'http:' || proxy_url.protocol === 'https:', 'invalid protocol for config.edge_config.proxy (expected http: or https:): ' + proxy_url.protocol);
lib/default-validator.js:      assert(proxy_url.hostname, 'invalid proxy host for config.edge_config.proxy: ' + proxy_url.hostname);
lib/default-validator.js:      assert(typeof config.edge_config.proxy_tunnel === 'boolean', 'config.edge_config.proxy_tunnel is not a boolean');
lib/default-validator.js:      assert(typeof config.edge_config.proxy !== 'undefined', 'config.edge_config.proxy must be defined if config.edge_config.proxy_tunnel is defined');
lib/default-validator.js:  assert(config.edgemicro, 'config.edgemicro is not defined');
lib/default-validator.js:  assert(config.edgemicro.port, 'config.edgemicro.port is not defined');
lib/default-validator.js:  assert(typeof config.edgemicro.port === 'number', port_message);
lib/default-validator.js:  assert(+config.edgemicro.port > 0, port_message);
lib/default-validator.js:  assert(+config.edgemicro.port < 65536, port_message);
lib/default-validator.js:  assert(config.edgemicro.logging, 'config.edgemicro.logging is not defined');
lib/default-validator.js:  assert(config.edgemicro.logging.level, 'config.edgemicro.logging.level is not defined');
lib/default-validator.js:  assert(config.edgemicro.logging.level === 'error' ||
lib/default-validator.js:  if (!config.edgemicro.logging.to_console) assert(config.edgemicro.logging.dir, 'config.edgemicro.logging.dir is not defined');
lib/default-validator.js:  assert(config.edgemicro.max_connections, 'config.edgemicro.max_connections is not defined');
lib/default-validator.js:  assert(typeof config.edgemicro.max_connections === 'number', 'config.edgemicro.max_connections is not a number');
lib/default-validator.js:      assert(Array.isArray(config.edgemicro.plugins.sequence), 'config.edgemicro.plugins.sequence is not an array');
lib/default-validator.js:    assert(config.quota.timeUnit === 'hour' ||
lib/default-validator.js:    assert(config.quota.interval, 'config.quota.interval is not defined');
lib/default-validator.js:    assert(typeof config.quota.interval === 'number', 'config.quota.interval is not a number');
lib/default-validator.js:    assert(+config.quota.interval > 0, interval_message);
lib/default-validator.js:    assert(config.quota.allow, 'config.quota.allow is not defined');
lib/default-validator.js:    assert(typeof config.quota.allow === 'number', 'config.quota.allow is not a number');
lib/default-validator.js:    assert(+config.quota.allow > 0, allow_message);
lib/default-validator.js:      assert(typeof config.analytics.bufferSize === 'number', 'config.analytics.bufferSize is not a number');
lib/default-validator.js:      assert(+config.analytics.bufferSize > 0, 'config.analytics.bufferSize is invalid');
lib/default-validator.js:      assert(typeof config.analytics.flushInterval === 'number', 'config.analytics.flushInterval is not a number');
lib/default-validator.js:      assert(+config.analytics.flushInterval > 0, 'config.analytics.flushInterval is invalid');
lib/default-validator.js:      assert(typeof config.analytics.batchSize === 'number', 'config.analytics.batchSize is not a number');
lib/default-validator.js:      assert(+config.analytics.batchSize > 0, 'config.analytics.batchSize is invalid');
lib/default-validator.js:    assert(config.spikearrest, 'config.spikearrest is not defined');
lib/default-validator.js:    assert(config.spikearrest.timeUnit, 'config.spikearrest.timeUnit is not defined');
lib/default-validator.js:    assert(config.spikearrest.timeUnit === 'minute' ||
lib/default-validator.js:      assert(typeof config.spikearrest.bufferSize === 'number', 'config.spikearrest.bufferSize is not a number');
lib/default-validator.js:      assert(+config.spikearrest.bufferSize > 0, 'config.spikearrest.bufferSize is invalid');
lib/default-validator.js:    assert(config.spikearrest.allow, 'config.spikearrest.allow is not defined');
lib/default-validator.js:    assert(typeof config.spikearrest.allow === 'number', 'config.spikearrest.allow is not a number');
lib/default-validator.js:    assert(+config.spikearrest.allow > 0, 'config.spikearrest.allow is invalid');
lib/default-validator.js:    assert(typeof config.oauth.allowNoAuthorization === 'boolean', 'config.oauth.allowNoAuthorization is not defined');
lib/default-validator.js:    assert(typeof config.oauth.allowInvalidAuthorization === 'boolean', 'config.oauth.allowInvalidAuthorization is not defined');
lib/io.js:  assert(options, 'must have options')
lib/io.js:  assert(source, 'must have source')
lib/io.js:  assert(configDir, 'must have configDir')
lib/io.js:  assert(fileName, 'must have targetFile')
lib/io.js:  assert(options, 'must have options');
lib/io.js:  assert(options.source, 'must have source to load from')
lib/io.js:  assert(options, 'must have options');
lib/io.js:  assert(target, 'target is not set');
lib/network.js:        assert(options, 'options cannot be null');
lib/network.js:        assert(options.keys, 'options.keys cannot be null');
lib/network.js:    assert(keys.key, 'key is missing');
lib/network.js:    assert(keys.secret, 'secret is missing');
lib/network.js:    assert(Array.isArray(proxies), 'proxies should be an array');
lib/network.js:    assert(Array.isArray(products), 'products should be an array');
lib/network.js:        assert(Array.isArray(product.proxies), 'proxies for product ' +
lib/proxy-validator.js:  assert(config, 'config is not defined');
lib/proxy-validator.js:  assert(config.proxies, 'config.proxies is not defined');
lib/proxy-validator.js:    assert(proxy.name, 'config.proxy[' + index + '].name is not defined');
lib/proxy-validator.js:    assert(proxy.proxy_name, 'config.proxy[' + index + '].proxy_name is not defined');
lib/proxy-validator.js:    assert(proxy.base_path, 'config.proxy[' + index + '].base_path is not defined');
lib/proxy-validator.js:    assert(proxy.target_name, 'config.proxy[' + index + '].proxy_name is not defined');
lib/proxy-validator.js:    assert(proxy.url, 'config.proxy[' + index + '].url is not defined');
lib/proxy-validator.js:    assert(proxy.revision, 'config.proxy[' + index + '].revision is not defined');
lib/proxy-validator.js:    assert(proxy.max_connections, 'config.proxy[' + index + '].max_connections is not defined');
lib/proxy-validator.js:    assert(typeof proxy.max_connections === 'number', 'config.proxy[' + index + '].max_connections is not a number');
lib/proxy-validator.js:    assert(config.analytics.uri, 'config.analytics.uri is not defined');
lib/proxy-validator.js:    assert(typeof config.analytics.uri === 'string', 'config.analytics.uri is not a string');
lib/proxy-validator.js:    assert(config.analytics.proxy, 'config.analytics.proxy is not defined');
lib/proxy-validator.js:    assert(config.analytics.proxy === 'dummy', 'config.analytics.proxy is not "dummy"');
lib/proxy-validator.js:    assert(config.analytics.source, 'config.analytics.source is not defined');
lib/proxy-validator.js:    assert(config.analytics.source === 'microgateway', 'config.analytics.source is not "microgateway"');
lib/proxy-validator.js:    assert(config.analytics.proxy_revision, 'config.analytics.proxy_revision is not defined');
lib/proxy-validator.js:    assert(typeof config.analytics.proxy_revision === 'number', 'config.analytics.proxy_revision is not a number');
lib/proxy-validator.js:    assert(typeof config.oauth.public_key === 'string', 'config.oauth.public_key is not defined');
lib/proxy-validator.js:    assert(typeof config.apikeys.public_key === 'string', 'config.apikeys.public_key is not defined');
lib/proxy-validator.js:    assert(typeof config.oauthv2.public_key === 'string', 'config.oauthv2.public_key is not defined');
`;

assrts = `
lib/config.js:  assert(config, 'config not initialized')
lib/gateway.js:        assert(config, ' must have a config')
lib/logging.js:  assert(config, 'must have config')
lib/logging.js:  assert(config.uid, 'config must have uid');
lib/logging.js:  assert(logConfig, 'must have config.edgemicro.logging in config');
lib/plugins-middleware.js:    assert(httpLibrary.request, 'must have request method');
lib/plugins.js:    assert(options.plugin, "must have plugin loaded in memory");
lib/plugins.js:      assert(_.isFunction(options.plugin.init), 'init must be a function');
lib/plugins.js:    assert(options.pluginName, "must have plugin name");
lib/plugins.js:    assert(_.isObject(middleware), 'ignoring invalid plugin handlers ' + name);
index.js:  assert(config, 'options must contain config')
index.js:  assert(name,"plugin must have a name")
index.js:  assert(_.isString(name),"name must be a string");
index.js:  assert(_.isFunction(plugin),"plugin must be a function(config,logger,stats){return {onresponse:function(req,res,data,next){}}}");
server.js:assert(key, 'must have a key');
server.js:assert(secret, 'must have a secret');
server.js:assert(source, 'must have a source config directory');
`


assrts = `
cli/lib/configure.js:    assert(secret, 'must have a secret');
cli/lib/deploy-auth.js:    assert(this.authUri);
cli/lib/deploy-auth.js:    assert(this.managementUri);
cli/lib/deploy-auth.js:    assert(dir, 'dir must be configured')
cli/lib/deploy-auth.js:    assert(callback, 'callback must be present')
cli/lib/key-gen.js:  assert(_.isFunction(cb));
cli/lib/key-gen.js:  assert(options);
cli/lib/private.js:        assert(options.username, 'username is required');
cli/lib/private.js:        assert(options.password, 'password is required');
cli/lib/private.js:    assert(options.org, 'org is required');
cli/lib/private.js:    assert(options.env, 'env is required');
cli/lib/private.js:    assert(options.runtimeUrl, 'runtimeUrl is required');
cli/lib/private.js:    assert(options.mgmtUrl, 'mgmtUrl is required');
cli/lib/start-agent.js:assert(argsJson);
cli/lib/token.js:  assert(options.file,"file is required")
cli/lib/token.js:  assert(options.file);
cli/lib/token.js:  assert(options.org)
cli/lib/token.js:  assert(options.env)
cli/lib/token.js:  assert(options.org);
cli/lib/token.js:  assert(options.env);
cli/lib/token.js:  assert(options.id);
cli/lib/token.js:  assert(options.secret);
lib/agent-config.js:  assert(options.target, 'must have target');
lib/plugins.js:  assert(config.edgemicro.plugins, 'plugins not configured');
lib/plugins.js:  assert(fs.existsSync(pluginDir), 'plugin dir does not exist: ' + pluginDir);
lib/plugins.js:  assert(stat.isDirectory(), 'plugin dir is not a directory: ' + pluginDir);
lib/plugins.js:  assert(dirs, 'error reading plugin dir: ' + pluginDir);
lib/server.js:  assert(token, 'must have a token');
lib/server.js:  assert(config, 'configpath cant be empty');
lib/server.js:  assert(key, 'must have EDGEMICRO_KEY');
lib/server.js:  assert(secret, 'must have EDGEMICRO_SECRET');

`

var assrts = assrts.split('\n')

var cleaned = assrts.map(line => {
    var parts = line.split(',')

    var explain = parts[1];
    if ( explain !== undefined ) {
        var prevExplain = explain.replace('\'','');
        while ( prevExplain != explain  ) {
            explain = prevExplain
            prevExplain = explain.replace('\'','');
        }
        //
        prevExplain = explain.replace('\"','');
        while ( prevExplain != explain  ) {
            explain = prevExplain
            prevExplain = explain.replace('\"','');
        }
        //
        explain = explain.trim();
        explain = explain.replace(';','')
        explain = explain.replace(')','')
        return explain
    }

    return('')
})


var oput = []
for ( var i = 0; i < assrts.length; i++ ) {
    if ( cleaned[i].length > 0 ) {
        oput.push( cleaned[i] + ' | ' + assrts[i])
    }  
}

console.log(oput.join('\n'))
