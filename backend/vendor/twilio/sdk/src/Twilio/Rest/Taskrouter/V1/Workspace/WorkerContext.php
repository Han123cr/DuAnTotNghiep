<?php

/**
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Taskrouter
 * This is the public Twilio REST API.
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


namespace Twilio\Rest\Taskrouter\V1\Workspace;

use Twilio\Exceptions\TwilioException;
use Twilio\ListResource;
use Twilio\Options;
use Twilio\Values;
use Twilio\Version;
use Twilio\InstanceContext;
use Twilio\Serialize;
use Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkerChannelList;
use Twilio\Rest\Taskrouter\V1\Workspace\Worker\ReservationList;
use Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkersRealTimeStatisticsList;
use Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkerStatisticsList;
use Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkersCumulativeStatisticsList;


/**
 * @property WorkerChannelList $workerChannels
 * @property ReservationList $reservations
 * @property WorkersRealTimeStatisticsList $realTimeStatistics
 * @property WorkerStatisticsList $statistics
 * @property WorkersCumulativeStatisticsList $cumulativeStatistics
 * @method \Twilio\Rest\Taskrouter\V1\Workspace\Worker\ReservationContext reservations(string $sid)
 * @method \Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkersRealTimeStatisticsContext realTimeStatistics()
 * @method \Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkerStatisticsContext statistics()
 * @method \Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkersCumulativeStatisticsContext cumulativeStatistics()
 * @method \Twilio\Rest\Taskrouter\V1\Workspace\Worker\WorkerChannelContext workerChannels(string $sid)
 */
class WorkerContext extends InstanceContext
    {
    protected $_workerChannels;
    protected $_reservations;
    protected $_realTimeStatistics;
    protected $_statistics;
    protected $_cumulativeStatistics;

    /**
     * Initialize the WorkerContext
     *
     * @param Version $version Version that contains the resource
     * @param string $workspaceSid The SID of the Workspace that the new Worker belongs to.
     * @param string $sid The SID of the Worker resource to delete.
     */
    public function __construct(
        Version $version,
        $workspaceSid,
        $sid
    ) {
        parent::__construct($version);

        // Path Solution
        $this->solution = [
        'workspaceSid' =>
            $workspaceSid,
        'sid' =>
            $sid,
        ];

        $this->uri = '/Workspaces/' . \rawurlencode($workspaceSid)
        .'/Workers/' . \rawurlencode($sid)
        .'';
    }

    /**
     * Delete the WorkerInstance
     *
     * @param array|Options $options Optional Arguments
     * @return bool True if delete succeeds, false otherwise
     * @throws TwilioException When an HTTP error occurs.
     */
    public function delete(array $options = []): bool
    {

        $options = new Values($options);

        $headers = Values::of(['Content-Type' => 'application/x-www-form-urlencoded' , 'If-Match' => $options['ifMatch']]);
        return $this->version->delete('DELETE', $this->uri, [], [], $headers);
    }


    /**
     * Fetch the WorkerInstance
     *
     * @return WorkerInstance Fetched WorkerInstance
     * @throws TwilioException When an HTTP error occurs.
     */
    public function fetch(): WorkerInstance
    {

        $headers = Values::of(['Content-Type' => 'application/x-www-form-urlencoded' ]);
        $payload = $this->version->fetch('GET', $this->uri, [], [], $headers);

        return new WorkerInstance(
            $this->version,
            $payload,
            $this->solution['workspaceSid'],
            $this->solution['sid']
        );
    }


    /**
     * Update the WorkerInstance
     *
     * @param array|Options $options Optional Arguments
     * @return WorkerInstance Updated WorkerInstance
     * @throws TwilioException When an HTTP error occurs.
     */
    public function update(array $options = []): WorkerInstance
    {

        $options = new Values($options);

        $data = Values::of([
            'ActivitySid' =>
                $options['activitySid'],
            'Attributes' =>
                $options['attributes'],
            'FriendlyName' =>
                $options['friendlyName'],
            'RejectPendingReservations' =>
                Serialize::booleanToString($options['rejectPendingReservations']),
        ]);

        $headers = Values::of(['Content-Type' => 'application/x-www-form-urlencoded' , 'If-Match' => $options['ifMatch']]);
        $payload = $this->version->update('POST', $this->uri, [], $data, $headers);

        return new WorkerInstance(
            $this->version,
            $payload,
            $this->solution['workspaceSid'],
            $this->solution['sid']
        );
    }


    /**
     * Access the workerChannels
     */
    protected function getWorkerChannels(): WorkerChannelList
    {
        if (!$this->_workerChannels) {
            $this->_workerChannels = new WorkerChannelList(
                $this->version,
                $this->solution['workspaceSid'],
                $this->solution['sid']
            );
        }

        return $this->_workerChannels;
    }

    /**
     * Access the reservations
     */
    protected function getReservations(): ReservationList
    {
        if (!$this->_reservations) {
            $this->_reservations = new ReservationList(
                $this->version,
                $this->solution['workspaceSid'],
                $this->solution['sid']
            );
        }

        return $this->_reservations;
    }

    /**
     * Access the realTimeStatistics
     */
    protected function getRealTimeStatistics(): WorkersRealTimeStatisticsList
    {
        if (!$this->_realTimeStatistics) {
            $this->_realTimeStatistics = new WorkersRealTimeStatisticsList(
                $this->version,
                $this->solution['workspaceSid'],
                $this->solution['sid']
            );
        }

        return $this->_realTimeStatistics;
    }

    /**
     * Access the statistics
     */
    protected function getStatistics(): WorkerStatisticsList
    {
        if (!$this->_statistics) {
            $this->_statistics = new WorkerStatisticsList(
                $this->version,
                $this->solution['workspaceSid'],
                $this->solution['sid']
            );
        }

        return $this->_statistics;
    }

    /**
     * Access the cumulativeStatistics
     */
    protected function getCumulativeStatistics(): WorkersCumulativeStatisticsList
    {
        if (!$this->_cumulativeStatistics) {
            $this->_cumulativeStatistics = new WorkersCumulativeStatisticsList(
                $this->version,
                $this->solution['workspaceSid'],
                $this->solution['sid']
            );
        }

        return $this->_cumulativeStatistics;
    }

    /**
     * Magic getter to lazy load subresources
     *
     * @param string $name Subresource to return
     * @return ListResource The requested subresource
     * @throws TwilioException For unknown subresources
     */
    public function __get(string $name): ListResource
    {
        if (\property_exists($this, '_' . $name)) {
            $method = 'get' . \ucfirst($name);
            return $this->$method();
        }

        throw new TwilioException('Unknown subresource ' . $name);
    }

    /**
     * Magic caller to get resource contexts
     *
     * @param string $name Resource to return
     * @param array $arguments Context parameters
     * @return InstanceContext The requested resource context
     * @throws TwilioException For unknown resource
     */
    public function __call(string $name, array $arguments): InstanceContext
    {
        $property = $this->$name;
        if (\method_exists($property, 'getContext')) {
            return \call_user_func_array(array($property, 'getContext'), $arguments);
        }

        throw new TwilioException('Resource does not have a context');
    }

    /**
     * Provide a friendly representation
     *
     * @return string Machine friendly representation
     */
    public function __toString(): string
    {
        $context = [];
        foreach ($this->solution as $key => $value) {
            $context[] = "$key=$value";
        }
        return '[Twilio.Taskrouter.V1.WorkerContext ' . \implode(' ', $context) . ']';
    }
}
