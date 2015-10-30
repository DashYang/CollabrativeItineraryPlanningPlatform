package cn.edu.fudan.mybaits;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

/**
 * @author dash
 * @version 1.0 date 2015-10-28
 * @since JDK1.6
 */
public interface LockReplicaDAO {
	@Insert("insert into lock_replica (`date`,`city`,`group`,`start`,`end`,`type`,`title`,`content`)"
			+ " values (#{date},#{city},#{group},#{start},#{end},#{type},#{title},#{content})")
	@SelectKey(before = false, keyProperty = "id",statement = { "SELECT last_insert_id() as id" }, resultType = java.lang.Integer.class)
	public int insert(LockReplica lockReplica);
	
	@Select("select * from lock_replica where `date` = #{date} and `city` = #{city} and `group` = #{group}")
	public List<LockReplica> getMessageByMapInfo(@Param(value="date") String date ,@Param(value="city") String city , @Param(value="group") String group);
	
	@Delete("delete from lock_replica where `id` = #{content}")
	public int delete(LockReplica lockReplica);
	
	@Update("update lock_replica set `content` = #{content} where `id` = #{start}")
	public int update(LockReplica lockReplica);
}
